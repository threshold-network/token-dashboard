import {
  BodyMd,
  Button,
  Checkbox,
  useColorModeValue,
} from "@threshold-network/components"
import { useWeb3React } from "@web3-react/core"
import { FormikErrors, FormikProps, withFormik } from "formik"
import { FC, Ref, useCallback, useRef, useState } from "react"
import { Form, FormikInput } from "../../../../components/Forms"
import withOnlyConnectedWallet from "../../../../components/withOnlyConnectedWallet"
import { useThreshold } from "../../../../contexts/ThresholdContext"
import { useTBTCDepositDataFromLocalStorage } from "../../../../hooks/tbtc"
import { useDepositTelemetry } from "../../../../hooks/tbtc/useDepositTelemetry"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { useToast } from "../../../../hooks/useToast"
import { BitcoinNetwork } from "../../../../threshold-ts/types"
import { MintingStep } from "../../../../types/tbtc"
import {
  getErrorsObj,
  validateBTCAddress,
  validateETHAddress,
} from "../../../../utils/forms"
import { supportedChainId } from "../../../../utils/getEnvVariable"
import { getBridgeBTCSupportedAddressPrefixesText } from "../../../../utils/tBTC"
import { downloadFile, isSameETHAddress } from "../../../../web3/utils"
import { BridgeProcessCardSubTitle } from "../components/BridgeProcessCardSubTitle"
import { BridgeProcessCardTitle } from "../components/BridgeProcessCardTitle"

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

/**
 * Renders the form for the minting process.
 * @param {string} formId - The ID of the form.
 * @return {JSX.Element} - Form component JSX.
 */
const MintingProcessFormBase: FC<ComponentProps & FormikProps<FormValues>> = ({
  formId,
}) => {
  return (
    <Form id={formId}>
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
        mb={6}
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
  const threshold = useThreshold()
  const { account } = useWeb3React()
  const { setDepositDataInLocalStorage } = useTBTCDepositDataFromLocalStorage()
  const depositTelemetry = useDepositTelemetry(threshold.tbtc.bitcoinNetwork)

  const textColor = useColorModeValue("gray.500", "gray.300")
  const [shouldDownloadDepositReceipt, setShouldDownloadDepositReceipt] =
    useState(true)
  const { addToast } = useToast("tbtc-bridge-minting")

  const handleDepositReceiptAgreementChange: React.ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    const {
      target: { checked },
    } = event
    setShouldDownloadDepositReceipt(checked)
  }

  const onSubmit = useCallback(
    async (values: FormValues) => {
      if (account && !isSameETHAddress(values.ethAddress, account)) {
        throw new Error(
          "The account used to generate the deposit address must be the same as the connected wallet."
        )
      }
      setSubmitButtonLoading(true)
      const deposit = await threshold.tbtc.initiateDeposit(
        values.btcRecoveryAddress
      )
      const depositAddress = await threshold.tbtc.calculateDepositAddress()
      const receipt = deposit.getReceipt()

      // update state,
      updateState("ethAddress", values.ethAddress)
      updateState("blindingFactor", receipt.blindingFactor.toString())
      updateState("btcRecoveryAddress", values.btcRecoveryAddress)
      updateState("walletPublicKeyHash", receipt.walletPublicKeyHash.toString())
      updateState("refundLocktime", receipt.refundLocktime.toString())

      // create a new deposit address,
      updateState("btcDepositAddress", depositAddress)

      setDepositDataInLocalStorage({
        ethAddress: values.ethAddress,
        blindingFactor: receipt.blindingFactor.toString(),
        btcRecoveryAddress: values.btcRecoveryAddress,
        walletPublicKeyHash: receipt.walletPublicKeyHash.toString(),
        refundLocktime: receipt.refundLocktime.toString(),
        btcDepositAddress: depositAddress,
      })

      depositTelemetry(receipt, depositAddress)

      // if the user has NOT declined the json file, ask the user if they want to accept the new file
      if (shouldDownloadDepositReceipt) {
        const date = new Date().toISOString().split("T")[0]

        const fileName = `${values.ethAddress}_${depositAddress}_${date}.json`

        const finalData = {
          ...receipt,
          btcRecoveryAddress: values.btcRecoveryAddress,
        }
        downloadFile(JSON.stringify(finalData), fileName, "text/json")
      }
      updateState("mintingStep", MintingStep.Deposit)
      addToast({
        title: "The system is continously checking for new BTC deposits",
        status: "info",
      })
    },
    [shouldDownloadDepositReceipt]
  )

  return (
    <>
      <BridgeProcessCardTitle onPreviousStepClick={onPreviousStepClick} />
      <BridgeProcessCardSubTitle
        stepText="Step 1"
        subTitle="Generate a Deposit Address"
      />
      <BodyMd color={textColor} mb={12}>
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
      <Checkbox
        defaultChecked
        mb={6}
        onChange={handleDepositReceiptAgreementChange}
      >
        Download Deposit Receipt (recommended)
      </Checkbox>
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
