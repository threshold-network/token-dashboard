import { FC } from "react"
import {
  BodyLg,
  BodyMd,
  Box,
  Card,
  FileUploader,
  FormControl,
} from "@threshold-network/components"
import { FormikErrors, FormikProps, withFormik } from "formik"
import { useNavigate } from "react-router-dom"
import { PageComponent } from "../../../types"
import { BridgeProcessCardTitle } from "./components/BridgeProcessCardTitle"
import { BridgeContractLink } from "../../../components/tBTC"
import { useTbtcState } from "../../../hooks/useTbtcState"
import { Form } from "../../../components/Forms"
import {
  isSameETHAddress,
  isAddress,
  parseJSONFile,
  InvalidJSONFileError,
} from "../../../web3/utils"
import { getErrorsObj, validateBTCAddress } from "../../../utils/forms"
import { useTBTCDepositDataFromLocalStorage } from "../../../hooks/tbtc"
import { useThreshold } from "../../../contexts/ThresholdContext"
import HelperErrorText from "../../../components/Forms/HelperErrorText"
import { DepositScriptParameters } from "../../../threshold-ts/tbtc"
import { BridgeProcessEmptyState } from "./components/BridgeProcessEmptyState"

type RecoveryJsonFileData = DepositScriptParameters & {
  networkInfo: {
    chainId: string
    chainName: string
  }
  btcRecoveryAddress: string
}
import { useIsActive } from "../../../hooks/useIsActive"
import SubmitTxButton from "../../../components/SubmitTxButton"
import { useCheckDepositExpirationTime } from "../../../hooks/tbtc/useCheckDepositExpirationTime"
import { BitcoinNetwork } from "@keep-network/tbtc-v2.ts"
import {
  AllowedL2TransactionTypes,
  SupportedChainIds,
} from "../../../networks/enums/networks"
import {
  isL1Network,
  isL2Network,
  isSameChainId,
  isSupportedNetwork,
} from "../../../networks/utils"

export const ResumeDepositPage: PageComponent = () => {
  const { updateState } = useTbtcState()
  const { account, chainId, isActive } = useIsActive()
  const navigate = useNavigate()
  const { setDepositDataInLocalStorage } = useTBTCDepositDataFromLocalStorage()
  const checkDepositExpiration = useCheckDepositExpirationTime()
  const threshold = useThreshold()

  if (!isActive || !isSupportedNetwork(chainId)) {
    return (
      <Card position="relative" maxW="640px" m={"0 auto"}>
        <BridgeProcessEmptyState title="Want to resume deposit?" />
      </Card>
    )
  }

  const navigateToMintPage = () => {
    navigate("/tBTC/mint")
  }

  const onSubmit = async (values: FormValues) => {
    if (!values.depositParameters) return
    const { depositParameters } = values

    try {
      if (isL1Network(chainId)) {
        await threshold.tbtc.initiateDepositFromDepositScriptParameters(
          depositParameters
        )
      } else {
        await threshold.tbtc.initiateCrossChainDepositFromScriptParameters(
          depositParameters,
          chainId!
        )
      }
      const btcDepositAddress = await threshold.tbtc.calculateDepositAddress()
      updateState("mintingStep", undefined)
      setDepositDataInLocalStorage(
        {
          chainName: depositParameters.networkInfo.chainName,
          ethAddress: depositParameters.depositor.identifierHex,
          blindingFactor: depositParameters.blindingFactor,
          btcRecoveryAddress: depositParameters.btcRecoveryAddress,
          walletPublicKeyHash: depositParameters.walletPublicKeyHash,
          refundLocktime: depositParameters.refundLocktime,
          extraData: depositParameters.extraData || "",
          btcDepositAddress,
        },
        chainId
      )
      navigateToMintPage()
    } catch (error) {
      console.error("Error during deposit initiation:", error)
    }
  }

  return (
    <Card position="relative" maxW="640px" m={"0 auto"}>
      <>
        <BridgeProcessCardTitle />
        <BodyLg>
          <Box as="span" fontWeight="600" color="brand.500">
            Resume Minting
          </Box>{" "}
          - Upload .JSON file
        </BodyLg>
        <BodyMd mt="3" mb="6">
          To resume your minting you need to upload your .JSON file and sign the
          Minting Initiation transaction triggered in the dApp.
        </BodyMd>
        <ResumeDepositFormik
          address={account!}
          chainId={chainId!}
          onSubmitForm={onSubmit}
          checkDepositExpiration={checkDepositExpiration}
          bitcoinNetwork={threshold.tbtc.bitcoinNetwork}
        />
        <Box as="p" textAlign="center" mt="10">
          <BridgeContractLink />
        </Box>
      </>
    </Card>
  )
}

const ResumeDepositForm: FC<FormikProps<FormValues>> = (props) => {
  const { setValues, getFieldMeta, setFieldError, isSubmitting, values } = props
  const { error } = getFieldMeta("depositParameters")

  const isError = Boolean(error)

  const onFileUpload = async (file: File | null) => {
    if (!file) {
      setValues({ depositParameters: null })
      return
    }

    try {
      const result = (await parseJSONFile(file)) as DepositDetails
      setValues({ depositParameters: result })
    } catch (error) {
      console.error("Unexpected error: ", (error as Error).toString())
      setFieldError(
        "depositParameters",
        error instanceof InvalidJSONFileError
          ? error.message
          : "Unexpected error while reading file, try again..."
      )
    }
  }

  return (
    <Form>
      <FormControl isInvalid={isError}>
        <FileUploader onFileUpload={onFileUpload} headerHelperText="Required" />
        <HelperErrorText hasError={isError} errorMsgText={error} />
      </FormControl>
      {/* Although the following button doesn't trigger an on-chain transaction, the 
      SubmitTxButton is used here for its built-in TRM Wallet screening validation logic. */}
      <SubmitTxButton
        l2TransactionType={AllowedL2TransactionTypes.mint}
        size="lg"
        isFullWidth
        mt="6"
        isDisabled={!values.depositParameters || isError || isSubmitting}
        type="submit"
        isLoading={isSubmitting}
      >
        Upload and Resume
      </SubmitTxButton>
    </Form>
  )
}

type DepositDetails = RecoveryJsonFileData

type FormValues = {
  depositParameters: DepositDetails | null
}

type ResumeDepositFormikProps = {
  onSubmitForm: (values: FormValues) => void
  address: string
  checkDepositExpiration: ReturnType<typeof useCheckDepositExpirationTime>
  bitcoinNetwork: BitcoinNetwork
  chainId: SupportedChainIds
}

const ResumeDepositFormik = withFormik<ResumeDepositFormikProps, FormValues>({
  mapPropsToValues: () => ({ depositParameters: null }),
  validate: async (
    values,
    { address, checkDepositExpiration, bitcoinNetwork, chainId }
  ) => {
    const errors: FormikErrors<FormValues> = {}

    const dp = values.depositParameters

    if (!dp) {
      errors.depositParameters = "Required."
    } else if (
      !dp.depositor ||
      !dp.depositor.identifierHex ||
      !dp.networkInfo?.chainName ||
      !dp.networkInfo?.chainId ||
      !isAddress(dp.depositor.identifierHex) ||
      !dp.refundLocktime ||
      !dp.refundPublicKeyHash ||
      !dp.blindingFactor ||
      !dp.walletPublicKeyHash ||
      !dp.btcRecoveryAddress
    ) {
      errors.depositParameters = "Invalid .JSON file."
    } else if (!isSameChainId(dp.networkInfo.chainId, chainId)) {
      errors.depositParameters = "Chain Id mismatch."
    } else if (isL2Network(chainId) && !dp.extraData) {
      errors.depositParameters = "Extra data is required for L2 networks."
    } else {
      const btcAddressError = validateBTCAddress(
        dp.btcRecoveryAddress as string,
        bitcoinNetwork
      )
      if (btcAddressError) {
        errors.depositParameters = btcAddressError
      } else {
        // Check deposit expiration
        const { isExpired } = await checkDepositExpiration(dp.refundLocktime)
        if (isExpired) {
          errors.depositParameters = "Deposit reveal time is expired."
        } else if (!isSameETHAddress(dp.depositor.identifierHex, address)) {
          errors.depositParameters = "You are not a depositor."
        }
      }
    }

    return getErrorsObj(errors)
  },

  handleSubmit: (values, { props }) => {
    props.onSubmitForm(values)
  },
  displayName: "ResumeDepositForm",
})(ResumeDepositForm)

ResumeDepositPage.route = {
  title: "Resume Deposit",
  path: "resume-deposit",
  index: false,
  isPageEnabled: true,
}
