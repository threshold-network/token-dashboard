import { FC, Ref, useRef } from "react"
import { FormikErrors, FormikProps, withFormik } from "formik"
import { Button, BodyMd } from "@threshold-network/components"
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
import { useThreshold } from "../../../../contexts/ThresholdContext"
import { useWeb3React } from "@web3-react/core"
import { BitcoinNetwork } from "../../../../threshold-ts/types"
import { useTBTCDepositDataFromLocalStorage } from "../../../../hooks/tbtc"
import withOnlyConnectedWallet from "../../../../components/withOnlyConnectedWallet"

export interface FormValues {
  ethAddress: string
  btcRecoveryAddress: string
  bitcoinNetwork: BitcoinNetwork
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
  validate: async (values) => {
    const errors: FormikErrors<FormValues> = {}
    errors.ethAddress = validateETHAddress(values.ethAddress)
    // TODO: check network
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
})(MintingProcessFormBase)

export const ProvideDataComponent: FC = () => {
  const { updateState, ethAddress, btcRecoveryAddress } = useTbtcState()
  const formRef = useRef<FormikProps<FormValues>>(null)
  const { openModal } = useModal()
  const threshold = useThreshold()
  const { account } = useWeb3React()
  const { setDepositDataInLocalStorage } = useTBTCDepositDataFromLocalStorage()

  const onSubmit = async (values: FormValues) => {
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

    // if the user has NOT declined the json file, ask the user if they want to accept the new file
    openModal(ModalType.TbtcRecoveryJson, {
      depositScriptParameters,
    })

    // do not ask about JSON file again if the user has not changed anything because they have already accepted/declined the same json file
    updateState("mintingStep", MintingStep.Deposit)
  }

  return (
    <>
      <TbtcMintingCardTitle />
      <TbtcMintingCardSubTitle stepText="Step 1" subTitle="Provide Data" />
      <BodyMd color="gray.500" mb={12}>
        Based on these two addresses, the system will generate for you an unique
        BTC deposit address. There is no minting limit
      </BodyMd>
      <MintingProcessForm
        innerRef={formRef}
        formId="tbtc-minting-data-form"
        initialEthAddress={account!}
        btcRecoveryAddress={"tb1q0tpdjdu2r3r7tzwlhqy4e2276g2q6fexsz4j0m"}
        bitcoinNetwork={threshold.tbtc.bitcoinNetwork}
        onSubmitForm={onSubmit}
      />
      <Button type="submit" form="tbtc-minting-data-form" isFullWidth>
        Generate Deposit Address
      </Button>
    </>
  )
}

export const ProvideData = withOnlyConnectedWallet(ProvideDataComponent)
