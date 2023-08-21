import { FC, Ref, useRef, useState } from "react"
import { FormikErrors, FormikProps, withFormik } from "formik"
import {
  Button,
  BodyMd,
  useColorModeValue,
} from "@threshold-network/components"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { BridgeProcessCardTitle } from "../components/BridgeProcessCardTitle"
import { BridgeProcessCardSubTitle } from "../components/BridgeProcessCardSubTitle"
import { Form, FormikInput } from "../../../../components/Forms"
import {
  getErrorsObj,
  validateBTCAddress,
  validateETHAddress,
} from "../../../../utils/forms"
import { MintingStep } from "../../../../types/tbtc"
import { useModal } from "../../../../hooks/useModal"
import { ModalType } from "../../../../enums"
import { useThreshold } from "../../../../contexts/ThresholdContext"
import { useWeb3React } from "@web3-react/core"
import { BitcoinNetwork } from "../../../../threshold-ts/types"
import { useTBTCDepositDataFromLocalStorage } from "../../../../hooks/tbtc"
import withOnlyConnectedWallet from "../../../../components/withOnlyConnectedWallet"
import { useDepositTelemetry } from "../../../../hooks/tbtc/useDepositTelemetry"
import { isSameETHAddress } from "../../../../web3/utils"
import { supportedChainId } from "../../../../utils/getEnvVariable"
import { getBridgeBTCSupportedAddressPrefixesText } from "../../../../utils/tBTC"

export interface FormValues {
  ethAddress: string
  btcRecoveryAddress: string
  bitcoinNetwork: BitcoinNetwork
}

type ComponentProps = {
  formId: string
}

const resolvedBTCAddressPrefix = getBridgeBTCSupportedAddressPrefixesText(
  "mint",
  supportedChainId === "1" ? BitcoinNetwork.Mainnet : BitcoinNetwork.Testnet
)

const MintingProcessFormBase: FC<ComponentProps & FormikProps<FormValues>> = ({
  formId,
}) => {
  return (
    <Form id={formId} mb={6}>
      <FormikInput
        name="ethAddress"
        label="ETH Address"
        placeholder="Address where you'll receive your tBTC"
        tooltip="ETH address is prepopulated with your wallet address. This is the address where you'll receive your tBTC."
        mb={6}
        isReadOnly={true}
      />
      <FormikInput
        name="btcRecoveryAddress"
        label="BTC Recovery Address"
        tooltip={`This address needs to start with ${resolvedBTCAddressPrefix}. Recovery Address is a BTC address where your BTC funds are sent back if something exceptional happens with your deposit. A Recovery Address cannot be a multi-sig or an exchange address. Funds claiming is done by using the JSON file`}
        placeholder={`BTC Address should start with ${resolvedBTCAddressPrefix}`}
      />
    </Form>
  )
}

type MintingProcessFormProps = {
  initialEthAddress: string
  btcRecoveryAddress: string
  bitcoinNetwork: BitcoinNetwork
  innerRef: Ref<FormikProps<FormValues>>
  onSubmitForm: (values: FormValues) => void
} & ComponentProps

const MintingProcessForm = withFormik<MintingProcessFormProps, FormValues>({
  mapPropsToValues: ({
    initialEthAddress,
    btcRecoveryAddress,
    bitcoinNetwork,
  }) => ({
    ethAddress: initialEthAddress,
    btcRecoveryAddress: btcRecoveryAddress,
    bitcoinNetwork: bitcoinNetwork,
  }),
  validate: async (values, props) => {
    const errors: FormikErrors<FormValues> = {}
    errors.ethAddress = validateETHAddress(values.ethAddress)
    errors.btcRecoveryAddress = validateBTCAddress(
      values.btcRecoveryAddress,
      values.bitcoinNetwork as any
    )
    return getErrorsObj(errors)
  },
  handleSubmit: (values, { props }) => {
    props.onSubmitForm(values)
  },
  displayName: "MintingProcessForm",
  enableReinitialize: true,
})(MintingProcessFormBase)

export const ProvideDataComponent: FC<{
  onPreviousStepClick: (previosuStep: MintingStep) => void
}> = ({ onPreviousStepClick }) => {
  const { updateState } = useTbtcState()
  const [isSubmitButtonLoading, setSubmitButtonLoading] = useState(false)
  const formRef = useRef<FormikProps<FormValues>>(null)
  const { openModal } = useModal()
  const threshold = useThreshold()
  const { account } = useWeb3React()
  const { setDepositDataInLocalStorage } = useTBTCDepositDataFromLocalStorage()
  const depositTelemetry = useDepositTelemetry(threshold.tbtc.bitcoinNetwork)

  const onSubmit = async (values: FormValues) => {
    if (account && !isSameETHAddress(values.ethAddress, account)) {
      throw new Error(
        "The account used to generate the deposit address must be the same as the connected wallet."
      )
    }
    setSubmitButtonLoading(true)
    const depositScriptParameters =
      await threshold.tbtc.createDepositScriptParameters(
        values.ethAddress,
        values.btcRecoveryAddress
      )

    const depositAddress = await threshold.tbtc.calculateDepositAddress(
      depositScriptParameters
    )

    // update state,
    updateState("ethAddress", values.ethAddress)
    updateState("blindingFactor", depositScriptParameters.blindingFactor)
    updateState("btcRecoveryAddress", values.btcRecoveryAddress)
    updateState(
      "walletPublicKeyHash",
      depositScriptParameters.walletPublicKeyHash
    )
    updateState("refundLocktime", depositScriptParameters.refundLocktime)

    // create a new deposit address,
    updateState("btcDepositAddress", depositAddress)

    setDepositDataInLocalStorage({
      ethAddress: values.ethAddress,
      blindingFactor: depositScriptParameters.blindingFactor,
      btcRecoveryAddress: values.btcRecoveryAddress,
      walletPublicKeyHash: depositScriptParameters.walletPublicKeyHash,
      refundLocktime: depositScriptParameters.refundLocktime,
      btcDepositAddress: depositAddress,
    })

    depositTelemetry(depositScriptParameters, depositAddress)

    // if the user has NOT declined the json file, ask the user if they want to accept the new file
    openModal(ModalType.TbtcRecoveryJson, {
      ethAddress: values.ethAddress,
      blindingFactor: depositScriptParameters.blindingFactor,
      walletPublicKeyHash: depositScriptParameters.walletPublicKeyHash,
      refundPublicKeyHash: depositScriptParameters.refundPublicKeyHash,
      refundLocktime: depositScriptParameters.refundLocktime,
      btcDepositAddress: depositAddress,
    })
    updateState("mintingStep", MintingStep.Deposit)
  }

  return (
    <>
      <BridgeProcessCardTitle onPreviousStepClick={onPreviousStepClick} />
      <BridgeProcessCardSubTitle
        stepText="Step 1"
        subTitle="Generate a Deposit Address"
      />
      <BodyMd color={useColorModeValue("gray.500", "gray.300")} mb={12}>
        Based on these two addresses, the system will generate for you a unique
        BTC deposit address. There is no minting limit.
      </BodyMd>
      <MintingProcessForm
        innerRef={formRef}
        formId="tbtc-minting-data-form"
        initialEthAddress={account!}
        btcRecoveryAddress={""}
        bitcoinNetwork={threshold.tbtc.bitcoinNetwork}
        onSubmitForm={onSubmit}
      />
      <Button
        isLoading={isSubmitButtonLoading}
        loadingText={"Generating deposit address..."}
        type="submit"
        form="tbtc-minting-data-form"
        isFullWidth
        data-ph-capture-attribute-button-name={`Generate Deposit Address (Deposit flow)`}
      >
        Generate Deposit Address
      </Button>
    </>
  )
}

export const ProvideData = withOnlyConnectedWallet(ProvideDataComponent)
