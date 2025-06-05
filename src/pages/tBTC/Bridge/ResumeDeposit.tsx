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
  isSameAddress,
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
    isStarkNetDeposit?: boolean
  }
  ethAddress: string
  btcRecoveryAddress: string
}
import { useIsActive } from "../../../hooks/useIsActive"
import SubmitTxButton from "../../../components/SubmitTxButton"
import { useCheckDepositExpirationTime } from "../../../hooks/tbtc/useCheckDepositExpirationTime"
import { BitcoinNetwork } from "@keep-network/tbtc-v2.ts"
import { SupportedChainIds } from "../../../networks/enums/networks"
import {
  isL1Network,
  isL2Network,
  isSameChainId,
  isSupportedNetwork,
} from "../../../networks/utils"
import { useNonEVMConnection } from "../../../hooks/useNonEVMConnection"
import { useStarknetWallet } from "../../../contexts/StarknetWalletProvider"
import { constants } from "starknet"
import { getDefaultProviderChainId } from "../../../utils/getEnvVariable"
import { isMainnetChainId as isMainnetEVMChainId } from "../../../networks/utils"

// Helper to get expected StarkNet chain ID based on environment
const getExpectedStarknetChainId = () => {
  const defaultChainId = getDefaultProviderChainId()
  return isMainnetEVMChainId(defaultChainId)
    ? constants.StarknetChainId.SN_MAIN
    : constants.StarknetChainId.SN_SEPOLIA
}

export const ResumeDepositPage: PageComponent = () => {
  const { updateState } = useTbtcState()
  const { account, chainId, isActive } = useIsActive()
  const { isNonEVMActive, nonEVMPublicKey } = useNonEVMConnection()
  const { provider: starknetProvider } = useStarknetWallet()
  const navigate = useNavigate()
  const { setDepositDataInLocalStorage } = useTBTCDepositDataFromLocalStorage()
  const checkDepositExpiration = useCheckDepositExpirationTime()
  const threshold = useThreshold()

  // Check for either EVM or non-EVM wallet connection
  const isWalletConnected = isActive || isNonEVMActive
  const connectedAddress = account || nonEVMPublicKey

  // For StarkNet only connections, use a default chainId (Sepolia)
  const effectiveChainId =
    chainId || (isNonEVMActive ? SupportedChainIds.Sepolia : undefined)

  if (!isWalletConnected || (!isNonEVMActive && !isSupportedNetwork(chainId))) {
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
      // For StarkNet deposits, we need to initialize cross-chain appropriately
      const isStarkNetDeposit =
        depositParameters.networkInfo?.chainName?.toLowerCase() === "starknet"

      if (isStarkNetDeposit) {
        // Initialize StarkNet cross-chain
        if (!starknetProvider) {
          throw new Error("StarkNet provider not available")
        }
        await threshold.tbtc.initiateCrossChain(
          starknetProvider,
          connectedAddress || "",
          "StarkNet"
        )
        // For StarkNet, we need to use a different initialization method
        await threshold.tbtc.initiateDepositFromDepositScriptParameters(
          depositParameters
        )
      } else if (isL1Network(effectiveChainId)) {
        await threshold.tbtc.initiateDepositFromDepositScriptParameters(
          depositParameters
        )
      } else {
        await threshold.tbtc.initiateCrossChainDepositFromScriptParameters(
          depositParameters,
          effectiveChainId!
        )
      }
      const btcDepositAddress = await threshold.tbtc.calculateDepositAddress()
      updateState("mintingStep", undefined)

      const storageChainId = isStarkNetDeposit
        ? depositParameters.networkInfo.chainId
        : effectiveChainId

      console.log("ResumeDeposit - saving to localStorage:", {
        isStarkNetDeposit,
        chainName: depositParameters.networkInfo?.chainName,
        networkChainId: depositParameters.networkInfo?.chainId,
        storageChainId,
        btcDepositAddress,
        depositor: depositParameters.depositor.identifierHex,
      })

      setDepositDataInLocalStorage(
        {
          depositor: {
            identifierHex: depositParameters.depositor.identifierHex,
          },
          chainName: depositParameters.networkInfo.chainName,
          ethAddress: depositParameters.ethAddress,
          blindingFactor: depositParameters.blindingFactor,
          btcRecoveryAddress: depositParameters.btcRecoveryAddress,
          walletPublicKeyHash: depositParameters.walletPublicKeyHash,
          refundLocktime: depositParameters.refundLocktime,
          extraData: depositParameters.extraData || "",
          btcDepositAddress,
        },
        isStarkNetDeposit
          ? depositParameters.networkInfo.chainId
          : effectiveChainId
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
          address={connectedAddress!}
          chainId={effectiveChainId!}
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
  const threshold = useThreshold()

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
        size="lg"
        isFullWidth
        mt="6"
        isDisabled={
          !values.depositParameters ||
          isError ||
          isSubmitting ||
          !threshold.tbtc.bridgeContract
        }
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

    console.log("ResumeDeposit validation:", {
      depositParameters: dp,
      networkInfo: dp?.networkInfo,
      chainName: dp?.networkInfo?.chainName,
      isStarkNet: dp?.networkInfo?.chainName === "StarkNet",
      chainId,
      address,
    })

    if (!dp) {
      errors.depositParameters = "Required."
    } else if (
      !dp.depositor ||
      !dp.depositor.identifierHex ||
      !dp.networkInfo?.chainName ||
      !dp.networkInfo?.chainId ||
      !dp.refundLocktime ||
      !dp.refundPublicKeyHash ||
      !dp.blindingFactor ||
      !dp.walletPublicKeyHash ||
      !dp.btcRecoveryAddress
    ) {
      errors.depositParameters = "Invalid .JSON file."
    } else if (!dp.networkInfo?.chainId) {
      errors.depositParameters = "Missing chain ID in deposit data."
    } else if (
      dp.networkInfo?.chainName?.toLowerCase() !== "starknet" &&
      !isAddress(dp.depositor.identifierHex)
    ) {
      errors.depositParameters = "Invalid depositor address for EVM network."
    } else if (
      dp.networkInfo?.chainName?.toLowerCase() === "starknet" ||
      dp.networkInfo?.chainId?.startsWith("0x534e5f") // StarkNet chain IDs start with this prefix
    ) {
      // For StarkNet deposits, validate against StarkNet chain IDs
      const expectedStarknetChainId = getExpectedStarknetChainId()
      const depositChainId = dp.networkInfo.chainId.toLowerCase()
      console.log("StarkNet validation:", {
        expectedStarknetChainId,
        depositChainId,
        match: depositChainId === expectedStarknetChainId.toLowerCase(),
      })
      if (depositChainId !== expectedStarknetChainId.toLowerCase()) {
        errors.depositParameters = `StarkNet chain mismatch. Expected ${expectedStarknetChainId} but deposit was for ${dp.networkInfo.chainId}.`
      }
    } else if (!isSameChainId(dp.networkInfo.chainId, chainId)) {
      console.log("EVM chain validation:", {
        depositChainId: dp.networkInfo.chainId,
        expectedChainId: chainId,
      })
      errors.depositParameters = `Chain Id mismatch. Expected ${chainId}, but deposit was for ${dp.networkInfo.chainId}.`
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
        } else if (
          dp.networkInfo?.chainName?.toLowerCase() === "starknet"
            ? dp.depositor.identifierHex.toLowerCase() !== address.toLowerCase()
            : !isSameAddress(dp.depositor.identifierHex, address)
        ) {
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
