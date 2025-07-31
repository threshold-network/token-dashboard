import {
  BodyMd,
  Checkbox,
  useColorModeValue,
} from "@threshold-network/components"
import { FormikErrors, FormikProps, withFormik } from "formik"
import {
  FC,
  Ref,
  useCallback,
  useRef,
  useState,
  useEffect,
  FocusEvent,
  ChangeEvent,
} from "react"
import { Form, FormikInput } from "../../../../components/Forms"
import withOnlyConnectedWallet from "../../../../components/withOnlyConnectedWallet"
import { useThreshold } from "../../../../contexts/ThresholdContext"
import { useTBTCDepositDataFromLocalStorage } from "../../../../hooks/tbtc"
import { useDepositTelemetry } from "../../../../hooks/tbtc/useDepositTelemetry"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { BitcoinNetwork, ChainName } from "../../../../threshold-ts/types"
import { MintingStep } from "../../../../types/tbtc"
import {
  getErrorsObj,
  validateBTCAddress,
  validateETHAddress,
} from "../../../../utils/forms"
import { SupportedChainIds } from "../../../../networks/enums/networks"
import {
  getEthereumNetworkNameFromChainId,
  isL1Network,
  isSupportedNetwork,
} from "../../../../networks/utils"
import { getBridgeBTCSupportedAddressPrefixesText } from "../../../../utils/tBTC"
import { downloadFile, isSameAddress } from "../../../../web3/utils"
import { BridgeProcessCardSubTitle } from "../components/BridgeProcessCardSubTitle"
import { BridgeProcessCardTitle } from "../components/BridgeProcessCardTitle"
import TbtcFees from "../components/TbtcFees"
import { useIsActive } from "../../../../hooks/useIsActive"
import { PosthogButtonId } from "../../../../types/posthog"
import SubmitTxButton from "../../../../components/SubmitTxButton"
import { Deposit } from "@keep-network/tbtc-v2.ts"
import { useModal } from "../../../../hooks/useModal"
import { ModalType } from "../../../../enums"
import { useAppSelector, useAppDispatch } from "../../../../hooks/store"
import { BridgeActivityStatus } from "../../../../threshold-ts/tbtc"
import { RootState } from "../../../../store"
import { tbtcSlice } from "../../../../store/tbtc/tbtcSlice"
import { accountSlice } from "../../../../store/account/slice"
import { useNonEVMConnection } from "../../../../hooks/useNonEVMConnection"

export interface FormValues {
  userWalletAddress: string
  btcRecoveryAddress: string
  bitcoinNetwork: BitcoinNetwork
}

type ComponentProps = {
  formId: string
}

/**
 * Renders the form for the minting process.
 * @param {string} formId - The ID of the form.
 * @return {JSX.Element} - Form component JSX.
 */
const MintingProcessFormBase: FC<ComponentProps & FormikProps<FormValues>> = ({
  formId,
  values,
}) => {
  const dispatch = useAppDispatch()
  const threshold = useThreshold()

  const resolvedBTCAddressPrefix = getBridgeBTCSupportedAddressPrefixesText(
    "mint",
    threshold.config.bitcoin.network === BitcoinNetwork.Testnet
      ? BitcoinNetwork.Testnet
      : BitcoinNetwork.Mainnet
  )

  const handleBtcAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    const btcAddress = event.target.value

    const isValidFormat =
      validateBTCAddress(btcAddress, threshold.tbtc.bitcoinNetwork) ===
      undefined

    if (btcAddress && isValidFormat) {
      dispatch(
        accountSlice.actions.bitcoinAddressSubmitted({
          btcAddress,
          ethChainId: SupportedChainIds.Ethereum,
        })
      )
    }
  }

  return (
    <Form id={formId}>
      <FormikInput
        name="userWalletAddress"
        label="User Wallet Address"
        placeholder="Address where you'll receive your tBTC"
        tooltip="The address is prepopulated with your wallet address. This is the address where you'll receive your tBTC."
        mb={6}
        isReadOnly={true}
      />
      <FormikInput
        name="btcRecoveryAddress"
        label="BTC Return Address"
        tooltip={`This address needs to start with ${resolvedBTCAddressPrefix}. Return Address is a BTC address where your BTC funds are sent back if something exceptional happens with your deposit. A Return Address cannot be a multi-sig or an exchange address. Funds claiming is done by using the JSON file`}
        placeholder={`BTC Address should start with ${resolvedBTCAddressPrefix}`}
        mb={6}
        onChange={handleBtcAddressChange}
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
    userWalletAddress: initialEthAddress,
    btcRecoveryAddress: btcRecoveryAddress,
    bitcoinNetwork: bitcoinNetwork,
  }),
  validate: async (values, props) => {
    const errors: FormikErrors<FormValues> = {}
    errors.userWalletAddress = validateETHAddress(values.userWalletAddress)
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
  validateOnChange: false,
})(MintingProcessFormBase)

export const ProvideDataComponent: FC<{
  onPreviousStepClick: (previosuStep: MintingStep) => void
}> = ({ onPreviousStepClick }) => {
  const { updateState } = useTbtcState()
  const [isSubmitButtonLoading, setSubmitButtonLoading] = useState(false)
  const [stagedDepositValues, setStagedDepositValues] =
    useState<FormValues | null>(null)
  const formRef = useRef<FormikProps<FormValues>>(null)
  const threshold = useThreshold()
  const { account, chainId } = useIsActive()
  const { isNonEVMActive, nonEVMPublicKey, nonEVMChainName } =
    useNonEVMConnection()
  const { setDepositDataInLocalStorage } = useTBTCDepositDataFromLocalStorage()
  const depositTelemetry = useDepositTelemetry(threshold.tbtc.bitcoinNetwork)
  const connectedAccount = account || nonEVMPublicKey
  const { openModal, closeModal: closeModalFromHook, modalType } = useModal()
  const dispatch = useAppDispatch()

  const bridgeActivity = useAppSelector(
    (state: RootState) => state.tbtc.bridgeActivity.data
  )

  const networkName =
    nonEVMChainName ?? getEthereumNetworkNameFromChainId(chainId)

  const textColor = useColorModeValue("gray.500", "gray.300")
  const [shouldDownloadDepositReceipt, setShouldDownloadDepositReceipt] =
    useState(true)

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
      if (
        connectedAccount &&
        !isSameAddress(values.userWalletAddress, connectedAccount)
      ) {
        throw new Error(
          "The account used to generate the deposit address must be the same as the connected wallet."
        )
      }

      if (!isNonEVMActive && !isSupportedNetwork(chainId)) {
        throw new Error(
          "You are currently connected to an unsupported network. Switch to a supported network"
        )
      }

      const chainName =
        nonEVMChainName || getEthereumNetworkNameFromChainId(chainId)

      setSubmitButtonLoading(true)

      let deposit: Deposit
      if (!isNonEVMActive && isL1Network(chainId)) {
        deposit = await threshold.tbtc.initiateDeposit(
          values.btcRecoveryAddress
        )
      } else {
        deposit = await threshold.tbtc.initiateCrossChainDeposit(
          values.btcRecoveryAddress,
          chainId as SupportedChainIds
        )
      }
      const btcDepositAddress = await threshold.tbtc.calculateDepositAddress()
      const receipt = deposit.getReceipt()

      // update state,
      updateState("userWalletAddress", values.userWalletAddress)
      updateState("depositor", receipt.depositor.identifierHex.toString())
      updateState("blindingFactor", receipt.blindingFactor.toString())
      updateState("btcRecoveryAddress", values.btcRecoveryAddress)
      updateState("walletPublicKeyHash", receipt.walletPublicKeyHash.toString())
      updateState("refundLocktime", receipt.refundLocktime.toString())
      updateState("extraData", receipt.extraData?.toString())
      updateState("chainName", chainName)

      // create a new deposit address,
      updateState("btcDepositAddress", btcDepositAddress)

      setDepositDataInLocalStorage(
        {
          depositor: {
            identifierHex: receipt.depositor.identifierHex.toString(),
          },
          chainName: chainName,
          userWalletAddress: values.userWalletAddress,
          blindingFactor: receipt.blindingFactor.toString(),
          btcRecoveryAddress: values.btcRecoveryAddress,
          walletPublicKeyHash: receipt.walletPublicKeyHash.toString(),
          refundLocktime: receipt.refundLocktime.toString(),
          btcDepositAddress,
          extraData: receipt.extraData?.toString() || "",
        },
        networkName
      )

      depositTelemetry(receipt, btcDepositAddress)

      // if the user has NOT declined the json file, ask the user if they want to accept the new file
      if (shouldDownloadDepositReceipt) {
        const date = new Date().toISOString().split("T")[0]

        const fileName = `${values.userWalletAddress}_${btcDepositAddress}_${date}.json`

        const finalData = {
          depositor: {
            identifierHex: receipt.depositor.identifierHex.toString(),
          },
          networkInfo: {
            chainName: chainName,
            chainId: chainId?.toString(),
          },
          refundLocktime: receipt.refundLocktime.toString(),
          refundPublicKeyHash: receipt.refundPublicKeyHash.toString(),
          blindingFactor: receipt.blindingFactor.toString(),
          userWalletAddress: values.userWalletAddress,
          walletPublicKeyHash: receipt.walletPublicKeyHash.toString(),
          btcRecoveryAddress: values.btcRecoveryAddress,
          extraData: receipt.extraData?.toString() ?? "",
        }
        downloadFile(JSON.stringify(finalData), fileName, "text/json")
      }
      updateState("mintingStep", MintingStep.Deposit)
    },
    [shouldDownloadDepositReceipt, chainId]
  )

  return (
    <>
      <BridgeProcessCardTitle onPreviousStepClick={onPreviousStepClick} />
      <BridgeProcessCardSubTitle
        stepText="Step 1"
        subTitle="Generate a Deposit Address"
      />
      <BodyMd color={textColor} mb={12}>
        Based on these two addresses, the system will generate a unique BTC
        deposit address for you. There is no limit to the amount you can
        deposit.
      </BodyMd>
      <MintingProcessForm
        innerRef={formRef}
        formId="tbtc-minting-data-form"
        initialEthAddress={(account || nonEVMPublicKey)!}
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
      <TbtcFees />
      {/* Although the following button doesn't trigger an on-chain transaction, the 
      SubmitTxButton is used here for its built-in TRM Wallet screening validation logic. */}
      <SubmitTxButton
        isDisabled={!threshold.tbtc.bridgeContract}
        isLoading={isSubmitButtonLoading}
        loadingText={
          isSubmitButtonLoading ? "Generating deposit address..." : undefined
        }
        type="submit"
        form="tbtc-minting-data-form"
        isFullWidth
        data-ph-capture-attribute-button-name={`Generate Deposit Address (Deposit flow)`}
        data-ph-capture-attribute-button-id={
          PosthogButtonId.GenerateDepositAddress
        }
        data-ph-capture-attribute-button-text={`Generate Deposit Address`}
      >
        Generate Deposit Address
      </SubmitTxButton>
    </>
  )
}

export const ProvideData = withOnlyConnectedWallet(ProvideDataComponent)
