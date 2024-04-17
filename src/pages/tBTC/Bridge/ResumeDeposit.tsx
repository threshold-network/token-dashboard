import { FC, useEffect } from "react"
import {
  BodyLg,
  BodyMd,
  Box,
  Button,
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
import { MintingStep } from "../../../types/tbtc"
import { Form } from "../../../components/Forms"
import {
  isSameETHAddress,
  isAddress,
  parseJSONFile,
  InvalidJSONFileError,
} from "../../../web3/utils"
import { getErrorsObj } from "../../../utils/forms"
import { useTBTCDepositDataFromLocalStorage } from "../../../hooks/tbtc"
import { useThreshold } from "../../../contexts/ThresholdContext"
import HelperErrorText from "../../../components/Forms/HelperErrorText"
import { DepositScriptParameters } from "../../../threshold-ts/tbtc"
import { BridgeProcessEmptyState } from "./components/BridgeProcessEmptyState"

type RecoveryJsonFileData = DepositScriptParameters & {
  btcRecoveryAddress: string
}
import { useIsActive } from "../../../hooks/useIsActive"

export const ResumeDepositPage: PageComponent = () => {
  const { updateState } = useTbtcState()
  const { account, isActive } = useIsActive()
  const navigate = useNavigate()
  const { setDepositDataInLocalStorage } = useTBTCDepositDataFromLocalStorage()
  const threshold = useThreshold()

  const navigateToMintPage = () => {
    navigate("/tBTC/mint")
  }

  const onSubmit = async (values: FormValues) => {
    if (!values.depositParameters) return

    const { depositParameters } = values
    await threshold.tbtc.initiateDepositFromDepositScriptParameters(
      depositParameters
    )
    const btcDepositAddress = await threshold.tbtc.calculateDepositAddress()

    updateState("mintingStep", undefined)

    setDepositDataInLocalStorage({
      ethAddress: depositParameters?.depositor.identifierHex!,
      blindingFactor: depositParameters?.blindingFactor!,
      btcRecoveryAddress: depositParameters?.btcRecoveryAddress!,
      walletPublicKeyHash: depositParameters?.walletPublicKeyHash!,
      refundLocktime: depositParameters?.refundLocktime!,
      btcDepositAddress,
    })

    navigateToMintPage()
  }

  return (
    <Card maxW="640px" m={"0 auto"}>
      {isActive ? (
        <>
          <BridgeProcessCardTitle />
          <BodyLg>
            <Box as="span" fontWeight="600" color="brand.500">
              Resume Minting
            </Box>{" "}
            - Upload .JSON file
          </BodyLg>
          <BodyMd mt="3" mb="6">
            To resume your minting you need to upload your .JSON file and sign
            the Minting Initiation transaction triggered in the dApp.
          </BodyMd>
          <ResumeDepositFormik address={account!} onSubmitForm={onSubmit} />
          <Box as="p" textAlign="center" mt="10">
            <BridgeContractLink />
          </Box>
        </>
      ) : (
        <BridgeProcessEmptyState title="Want to resume deposit?" />
      )}
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

      <Button
        size="lg"
        isFullWidth
        mt="6"
        disabled={!values.depositParameters || isError || isSubmitting}
        type="submit"
        isLoading={isSubmitting}
      >
        Upload and Resume
      </Button>
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
}

const ResumeDepositFormik = withFormik<ResumeDepositFormikProps, FormValues>({
  mapPropsToValues: () => ({ depositParameters: null }),
  validate: (values, { address }) => {
    const errors: FormikErrors<FormValues> = {}

    if (!values.depositParameters) {
      errors.depositParameters = "Required."
    } else if (
      !values.depositParameters?.depositor ||
      !values.depositParameters?.depositor?.identifierHex ||
      !isAddress(values.depositParameters?.depositor?.identifierHex) ||
      !values.depositParameters?.refundLocktime ||
      !values.depositParameters?.refundPublicKeyHash ||
      !values.depositParameters?.blindingFactor ||
      !values.depositParameters?.walletPublicKeyHash ||
      !values.depositParameters?.btcRecoveryAddress
    ) {
      errors.depositParameters = "Invalid .JSON file."
    } else if (
      !isSameETHAddress(
        values.depositParameters?.depositor?.identifierHex,
        address
      )
    ) {
      errors.depositParameters = "You are not a depositor."
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
