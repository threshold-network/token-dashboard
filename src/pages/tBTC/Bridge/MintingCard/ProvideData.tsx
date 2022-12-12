import { FC, Ref, useRef } from "react"
import { FormikErrors, FormikProps, withFormik } from "formik"
import { Box, Button, Flex, BodyMd } from "@threshold-network/components"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { TbtcMintingCardTitle } from "../components/TbtcMintingCardTitle"
import { TbtcMintingCardSubTitle } from "../components/TbtcMintingCardSubtitle"
import { Form, FormikInput } from "../../../../components/Forms"
import {
  getErrorsObj,
  validateBTCAddress,
  validateETHAddress,
} from "../../../../utils/forms"
import { MintingStep } from "../../../../types/tbtc"
import { useModal } from "../../../../hooks/useModal"
import { ModalType } from "../../../../enums"
import { createDepositScriptParameters } from "../../../../utils/tbtc-v2"
import { DepositScriptParameters } from "@keep-network/tbtc-v2.ts/dist/deposit"
import { downloadFile } from "../../../../web3/utils"
import { useThreshold } from "../../../../contexts/ThresholdContext"
import { useTBTCBridgeContractAddress } from "../../../../hooks/useTBTCBridgeContractAddress"

export interface FormValues {
  ethAddress: string
  btcRecoveryAddress: string
}

type ComponentProps = {
  formId: string
}

const MintingProcessFormBase: FC<ComponentProps & FormikProps<FormValues>> = ({
  formId,
}) => {
  return (
    <Form id={formId} mb={6}>
      <FormikInput
        name="ethAddress"
        label="ETH address"
        tooltip="ETH address is prepopulated with your wallet address. This is the address where you’ll receive your tBTC."
        mb={6}
      />
      <FormikInput
        name="btcRecoveryAddress"
        label="BTC Recovery Address"
        tooltip="Recovery Address is a BTC address where your BTC funds are sent back if something exceptional happens with your deposit. The funds can be claimed."
      />
    </Form>
  )
}

type MintingProcessFormProps = {
  initialEthAddress: string
  innerRef: Ref<FormikProps<FormValues>>
  onSubmitForm: (values: FormValues) => void
} & ComponentProps

const MintingProcessForm = withFormik<MintingProcessFormProps, FormValues>({
  mapPropsToValues: ({ initialEthAddress }) => ({
    ethAddress: initialEthAddress,
    btcRecoveryAddress: "17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhem",
  }),
  validate: async (values) => {
    const errors: FormikErrors<FormValues> = {}
    errors.ethAddress = validateETHAddress(values.ethAddress)
    errors.btcRecoveryAddress = validateBTCAddress(values.btcRecoveryAddress)
    return getErrorsObj(errors)
  },
  handleSubmit: (values, { props }) => {
    props.onSubmitForm(values)
  },
  displayName: "MintingProcessForm",
})(MintingProcessFormBase)

export const ProvideData: FC = () => {
  const { updateState, ethAddress, btcRecoveryAddress } = useTbtcState()
  const formRef = useRef<FormikProps<FormValues>>(null)
  const { openModal, closeModal } = useModal()
  const threshold = useThreshold()

  const handleJsonDownload = (data: DepositScriptParameters) => {
    downloadFile(
      JSON.stringify(data),
      "deposit-script-parameters.json",
      "text/json"
    )

    closeModal()
    updateState("mintingStep", MintingStep.Deposit)
  }

  const handleDoubleReject = () => {
    updateState("mintingStep", MintingStep.Deposit)
    closeModal()
  }

  const bridgeContractAddress = useTBTCBridgeContractAddress()

  const onSubmit = async (values: FormValues) => {
    // check if the user has changed the eth or btc address from the previous attempt
    if (
      ethAddress !== values.ethAddress ||
      btcRecoveryAddress !== values.btcRecoveryAddress
    ) {
      // if so...
      const depositScriptParameters = createDepositScriptParameters(
        values.ethAddress,
        values.btcRecoveryAddress
      )

      // TODO: calculate the deposit address using threshold-ts lib based on the
      // `depositScriptParameters`.
      const depositAddress = "3P14159f73E4gFr7JterCCQh9QjiTjiZrG"

      // update state,
      updateState("btcRecoveryAddress", values.btcRecoveryAddress)
      updateState("ethAddress", values.ethAddress)

      // create a new deposit address,
      updateState("btcDepositAddress", depositAddress)

      // if the user has NOT declined the json file, ask the user if they want to accept the new file
      openModal(ModalType.TbtcRecoveryJson, {
        jsonData: depositScriptParameters,
        handleDownloadClick: handleJsonDownload,
        handleDoubleReject,
      })
    }

    // do not ask about JSON file again if the user has not changed anything because they have already accepted/declined the same json file
    updateState("mintingStep", MintingStep.Deposit)
  }

  return (
    <Box>
      <TbtcMintingCardTitle />
      <TbtcMintingCardSubTitle stepText="Step 1" subTitle="Provide Data" />
      <BodyMd color="gray.500" mb={12}>
        Based on these two addresses, the system will generate for you an unique
        BTC deposit address. There is no minting limit
      </BodyMd>
      <MintingProcessForm
        innerRef={formRef}
        formId="tbtc-minting-data-form"
        initialEthAddress="0xdad30fd9D55Fe12E3435Fb32705242bc1b42a520"
        onSubmitForm={onSubmit}
      />
      <Button type="submit" form="tbtc-minting-data-form" isFullWidth>
        Generate Deposit Address
      </Button>
    </Box>
  )
}
