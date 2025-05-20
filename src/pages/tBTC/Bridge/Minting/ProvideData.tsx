import {
  BodyMd,
  Checkbox,
  useColorModeValue,
} from "@threshold-network/components"
import { FormikErrors, FormikProps, withFormik } from "formik"
import { FC, Ref, useCallback, useRef, useState } from "react"
import { Form, FormikInput } from "../../../../components/Forms"
import withOnlyConnectedWallet from "../../../../components/withOnlyConnectedWallet"
import { useThreshold } from "../../../../contexts/ThresholdContext"
import { useTBTCDepositDataFromLocalStorage } from "../../../../hooks/tbtc"
import { useDepositTelemetry } from "../../../../hooks/tbtc/useDepositTelemetry"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import {
  BitcoinNetwork,
  ChainName as SDKChainName,
} from "../../../../threshold-ts/types"
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
  isTestnetChainId,
} from "../../../../networks/utils"
import { getBridgeBTCSupportedAddressPrefixesText } from "../../../../utils/tBTC"
import { downloadFile, isSameAddress } from "../../../../web3/utils"
import { safeDownloadJSON } from "../../../../web3/utils/files"
import { BridgeProcessCardSubTitle } from "../components/BridgeProcessCardSubTitle"
import { BridgeProcessCardTitle } from "../components/BridgeProcessCardTitle"
import TbtcFees from "../components/TbtcFees"
import { useIsActive } from "../../../../hooks/useIsActive"
import { PosthogButtonId } from "../../../../types/posthog"
import SubmitTxButton from "../../../../components/SubmitTxButton"
import { Deposit, Hex as SDKHex } from "@keep-network/tbtc-v2.ts"
import { useNonEVMConnection } from "../../../../hooks/useNonEVMConnection"
import { useWallet as useSuiWallet } from "@suiet/wallet-kit"
import { useModal } from "../../../../hooks/useModal"
import { ModalType } from "../../../../enums"
import { safeToString } from "../../../../utils/sdkDebugger"
import { generateDepositReceiptFile } from "../../../../utils/depositHelper"

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
}) => {
  const { chainId } = useIsActive()
  const resolvedBTCAddressPrefix = getBridgeBTCSupportedAddressPrefixesText(
    "mint",
    isTestnetChainId(chainId as number)
      ? BitcoinNetwork.Testnet
      : BitcoinNetwork.Mainnet
  )

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
})(MintingProcessFormBase)

export const ProvideDataComponent: FC<{
  onPreviousStepClick: (previosuStep: MintingStep) => void
}> = ({ onPreviousStepClick }) => {
  const { updateState } = useTbtcState()
  const [isSubmitButtonLoading, setSubmitButtonLoading] = useState(false)
  const formRef = useRef<FormikProps<FormValues>>(null)
  const threshold = useThreshold()
  const tbtcInstance = threshold.tbtc
  const { account, chainId } = useIsActive()
  const { isNonEVMActive, nonEVMPublicKey, nonEVMChainName } =
    useNonEVMConnection()
  const {
    connected: suiConnected,
    account: suiAccount,
    adapter: suiAdapter,
  } = useSuiWallet()
  const { openModal } = useModal()
  const { setDepositDataInLocalStorage } = useTBTCDepositDataFromLocalStorage()
  const depositTelemetry = useDepositTelemetry(tbtcInstance.bitcoinNetwork)

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
      if (account && !isSameAddress(values.userWalletAddress, account)) {
        throw new Error(
          "The account used to generate the deposit address must be the same as the connected wallet."
        )
      }

      if (
        nonEVMPublicKey &&
        !isSameAddress(values.userWalletAddress, nonEVMPublicKey)
      ) {
        throw new Error(
          "The non-EVM account used to generate the deposit address must be the same as the connected wallet."
        )
      }

      if (!isNonEVMActive && !isSupportedNetwork(chainId)) {
        throw new Error(
          "You are currently connected to an unsupported network. Switch to a supported network"
        )
      }

      if (nonEVMChainName === SDKChainName.SUI) {
        if (!suiConnected || !suiAccount?.address) {
          console.log(
            "SUI Wallet not connected or address unavailable for SUI deposit generation."
          )
          alert(
            "Please connect your SUI wallet (and ensure address is available) to generate a deposit address for the SUI network."
          )
          openModal(ModalType.SelectWallet)
          setSubmitButtonLoading(false)
          return
        } else {
          if (
            suiAdapter &&
            tbtcInstance &&
            typeof tbtcInstance.updateSuiSigner === "function"
          ) {
            console.log(
              "SUI Wallet connected, calling tbtcInstance.updateSuiSigner with adapter and address."
            )
            await tbtcInstance.updateSuiSigner(suiAdapter, suiAccount.address)
          } else {
            console.warn(
              "SUI wallet connected, but adapter not available or updateSuiSigner not on tbtc instance. Cannot update SUI signer/owner in SDK."
            )
          }
        }
      }

      const ethChainName = getEthereumNetworkNameFromChainId(chainId)

      if (!tbtcInstance) {
        console.error("tBTC instance is not available!")
        setSubmitButtonLoading(false)
        return
      }

      setSubmitButtonLoading(true)

      let deposit: Deposit
      if (isL1Network(chainId)) {
        deposit = await tbtcInstance.initiateDeposit(values.btcRecoveryAddress)
      } else {
        deposit = await tbtcInstance.initiateCrossChainDeposit(
          values.btcRecoveryAddress,
          chainId as SupportedChainIds
        )
      }
      const btcDepositAddress = await tbtcInstance.calculateDepositAddress()
      const receipt = deposit.getReceipt()

      // Initial detailed logs for extraData (these are fine and can be kept or commented)
      console.log(
        "[ProvideData DEBUG] Full receipt object from deposit.getReceipt():",
        JSON.stringify(receipt, null, 2)
      )
      console.log(
        "[ProvideData DEBUG] receipt.extraData from deposit.getReceipt():",
        receipt.extraData
      )
      if (receipt.extraData) {
        console.log(
          "[ProvideData DEBUG] receipt.extraData.toString() attempt will be made on (raw value):",
          receipt.extraData
        )
        console.log(
          "[ProvideData DEBUG] typeof receipt.extraData:",
          typeof receipt.extraData
        )
        try {
          console.log(
            "[ProvideData DEBUG] receipt.extraData instanceof SDKHex:",
            receipt.extraData instanceof SDKHex
          )
        } catch (e) {
          console.warn(
            "[ProvideData DEBUG] Could not perform instanceof SDKHex check:",
            e
          )
        }
        console.log(
          "[ProvideData DEBUG] Attempting receipt.extraData.toString() result:",
          receipt.extraData.toString()
        )
      } else {
        console.log(
          "[ProvideData DEBUG] receipt.extraData is undefined or null at point of use."
        )
      }

      // Log before updateState calls
      console.log("--- [ProvideData DEBUG] Before updateState calls ---")
      console.log("receipt.depositor:", receipt.depositor)
      console.log(
        "receipt.depositor?.identifierHex:",
        receipt.depositor?.identifierHex
      )
      console.log("receipt.blindingFactor:", receipt.blindingFactor)
      console.log("receipt.walletPublicKeyHash:", receipt.walletPublicKeyHash)
      console.log("receipt.refundLocktime:", receipt.refundLocktime)
      console.log("receipt.extraData (for updateState):", receipt.extraData)

      // update state
      updateState("userWalletAddress", values.userWalletAddress)
      updateState("depositor", receipt.depositor?.identifierHex?.toString())
      updateState("blindingFactor", receipt.blindingFactor?.toString())
      updateState("btcRecoveryAddress", values.btcRecoveryAddress)
      updateState(
        "walletPublicKeyHash",
        receipt.walletPublicKeyHash?.toString()
      )
      updateState("refundLocktime", receipt.refundLocktime?.toString())
      updateState("extraData", receipt.extraData?.toString())
      updateState("chainName", ethChainName)

      // create a new deposit address,
      updateState("btcDepositAddress", btcDepositAddress)

      // Log before setDepositDataInLocalStorage
      console.log(
        "--- [ProvideData DEBUG] Before setDepositDataInLocalStorage --- "
      )
      console.log("receipt.depositor (for localStorage):", receipt.depositor)
      console.log(
        "receipt.depositor?.identifierHex (for localStorage):",
        receipt.depositor?.identifierHex
      )
      console.log(
        "receipt.blindingFactor (for localStorage):",
        receipt.blindingFactor
      )
      console.log(
        "receipt.walletPublicKeyHash (for localStorage):",
        receipt.walletPublicKeyHash
      )
      console.log(
        "receipt.refundLocktime (for localStorage):",
        receipt.refundLocktime
      )
      console.log("receipt.extraData (for localStorage):", receipt.extraData)

      setDepositDataInLocalStorage(
        {
          depositor: {
            identifierHex: receipt.depositor?.identifierHex?.toString() || "",
          },
          chainName: ethChainName,
          userWalletAddress: values.userWalletAddress,
          blindingFactor: receipt.blindingFactor?.toString() || "",
          btcRecoveryAddress: values.btcRecoveryAddress,
          walletPublicKeyHash: receipt.walletPublicKeyHash?.toString() || "",
          refundLocktime: receipt.refundLocktime?.toString() || "",
          btcDepositAddress,
          extraData: receipt.extraData?.toString() || "",
        },
        networkName
      )

      depositTelemetry(receipt, btcDepositAddress)

      // Log before finalData for download (this block can be condensed after testing)
      console.log("--- [ProvideData DEBUG] Before finalData for download --- ")
      console.log("receipt.depositor (for download):", receipt.depositor)
      console.log(
        "receipt.depositor?.identifierHex (for download):",
        receipt.depositor?.identifierHex
      )
      console.log(
        "receipt.refundLocktime (for download):",
        receipt.refundLocktime
      )
      console.log(
        "receipt.refundPublicKeyHash (for download):",
        receipt.refundPublicKeyHash
      )
      console.log(
        "receipt.blindingFactor (for download):",
        receipt.blindingFactor
      )
      console.log(
        "receipt.walletPublicKeyHash (for download):",
        receipt.walletPublicKeyHash
      )
      console.log("receipt.extraData (for download):", receipt.extraData)

      console.log("--- [ProvideData DEBUG] Strings prepared for finalData --- ")

      // Use our safe conversion utilities to avoid toString errors
      const depositorIdHexStr =
        receipt.depositor && receipt.depositor.identifierHex
          ? safeToString(receipt.depositor.identifierHex, "")
          : ""
      const refundLocktimeStr = safeToString(receipt.refundLocktime, "")
      const refundPublicKeyHashStr = safeToString(
        receipt.refundPublicKeyHash,
        ""
      )
      const blindingFactorStr = safeToString(receipt.blindingFactor, "")
      const walletPublicKeyHashStr = safeToString(
        receipt.walletPublicKeyHash,
        ""
      )
      const extraDataStringForDownload = safeToString(receipt.extraData, "")

      console.log({
        depositorIdHexStr,
        refundLocktimeStr,
        refundPublicKeyHashStr,
        blindingFactorStr,
        walletPublicKeyHashStr,
        extraDataStringForDownload,
      })

      if (shouldDownloadDepositReceipt) {
        // Use our helper utility to generate and download the receipt file
        const receiptGenerated = generateDepositReceiptFile({
          receipt,
          userWalletAddress: values.userWalletAddress,
          btcRecoveryAddress: values.btcRecoveryAddress,
          btcDepositAddress,
          ethChainName,
          chainId,
        })

        if (!receiptGenerated) {
          console.error("Failed to generate deposit receipt file")
          // Optional: You could show a user-facing error message here
        }
      }
      updateState("mintingStep", MintingStep.Deposit)
    },
    [
      account,
      chainId,
      nonEVMPublicKey,
      isNonEVMActive,
      nonEVMChainName,
      suiConnected,
      suiAccount,
      suiAdapter,
      openModal,
      tbtcInstance,
      updateState,
      setDepositDataInLocalStorage,
      depositTelemetry,
      shouldDownloadDepositReceipt,
    ]
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
        bitcoinNetwork={tbtcInstance.bitcoinNetwork}
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
        isDisabled={!tbtcInstance.bridgeContract}
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
