import {
  BodyMd,
  Checkbox,
  useColorModeValue,
} from "@threshold-network/components"
import { FormikErrors, FormikProps, withFormik } from "formik"
import { FC, Ref, useCallback, useRef, useState } from "react"
import { Form, FormikInput } from "../../../../components/Forms"
import withWalletConnection from "../../../../components/withWalletConnection"
import { useThreshold } from "../../../../contexts/ThresholdContext"
import { useTBTCDepositDataFromLocalStorage } from "../../../../hooks/tbtc"
import { useDepositTelemetry } from "../../../../hooks/tbtc/useDepositTelemetry"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { BitcoinNetwork } from "../../../../threshold-ts/types"
import { MintingStep } from "../../../../types/tbtc"
import {
  getErrorsObj,
  validateBTCAddress,
  validateUserWalletAddress,
} from "../../../../utils/forms"
import { SupportedChainIds } from "../../../../networks/enums/networks"
import {
  getChainIdToNetworkName,
  isL1Network,
  isSupportedNetwork,
  isTestnetChainId,
} from "../../../../networks/utils"
import { getBridgeBTCSupportedAddressPrefixesText } from "../../../../utils/tBTC"
import {
  downloadFile,
  isSameETHAddress,
  isSameAddress,
} from "../../../../web3/utils"
import { BridgeProcessCardSubTitle } from "../components/BridgeProcessCardSubTitle"
import { BridgeProcessCardTitle } from "../components/BridgeProcessCardTitle"
import TbtcFees from "../components/TbtcFees"
import { useIsActive } from "../../../../hooks/useIsActive"
import { PosthogButtonId } from "../../../../types/posthog"
import SubmitTxButton from "../../../../components/SubmitTxButton"
import { Deposit } from "@keep-network/tbtc-v2.ts"
import { useNonEVMConnection } from "../../../../hooks/useNonEVMConnection"
import { useStarkNetStatus } from "../../../../contexts/ThresholdContext"
import { ChainName } from "../../../../threshold-ts/types"
import {
  initializeStarkNetDeposit,
  isValidStarkNetAddress,
  checkStarkNetNetworkCompatibility,
  getStarkNetConfig,
} from "../../../../utils/tbtcStarknetHelpers"
import { StarkNetLoadingState } from "../components/StarkNetLoadingState"
import { StarkNetErrorState } from "../components/StarkNetErrorState"
import { featureFlags } from "../../../../constants"
import { useStarknetConnection } from "../../../../hooks/useStarknetConnection"

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
  const { nonEVMChainName, isNonEVMActive } = useNonEVMConnection()
  // StarkNet detection - MUST be explicit to avoid affecting other chains
  const isStarkNetDeposit =
    featureFlags.STARKNET_ENABLED &&
    isNonEVMActive &&
    nonEVMChainName === ChainName.Starknet
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
        tooltip="User wallet address is prepopulated with your connected wallet address. This is the address where you'll receive your tBTC."
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
  initialUserWalletAddress: string
  btcRecoveryAddress: string
  bitcoinNetwork: BitcoinNetwork
  innerRef: Ref<FormikProps<FormValues>>
  onSubmitForm: (values: FormValues) => void
} & ComponentProps

const MintingProcessForm = withFormik<MintingProcessFormProps, FormValues>({
  mapPropsToValues: ({
    initialUserWalletAddress,
    btcRecoveryAddress,
    bitcoinNetwork,
  }) => ({
    userWalletAddress: initialUserWalletAddress,
    btcRecoveryAddress: btcRecoveryAddress,
    bitcoinNetwork: bitcoinNetwork,
  }),
  validate: async (values, props) => {
    const errors: FormikErrors<FormValues> = {}
    errors.userWalletAddress = validateUserWalletAddress(
      values.userWalletAddress
    )

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
  const { account, chainId } = useIsActive()
  const { setDepositDataInLocalStorage } = useTBTCDepositDataFromLocalStorage()
  const depositTelemetry = useDepositTelemetry(threshold.tbtc.bitcoinNetwork)
  const { nonEVMChainName, isNonEVMActive, nonEVMPublicKey } =
    useNonEVMConnection()
  const starkNetStatus = useStarkNetStatus()
  const { chainId: starknetChainId } = useStarknetConnection()

  // Check if this is a StarkNet deposit
  // StarkNet detection - MUST be explicit to avoid affecting other chains
  const isStarkNetDeposit =
    featureFlags.STARKNET_ENABLED &&
    isNonEVMActive &&
    nonEVMChainName === ChainName.Starknet

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
      // For StarkNet, compare with nonEVMPublicKey; for EVM, compare with account
      const connectedAddress = isStarkNetDeposit ? nonEVMPublicKey : account

      if (
        connectedAddress &&
        !isSameAddress(values.userWalletAddress, connectedAddress)
      ) {
        throw new Error(
          "The account used to generate the deposit address must be the same as the connected wallet."
        )
      }

      // For EVM deposits, check if the network is supported
      if (!isStarkNetDeposit && !isSupportedNetwork(chainId)) {
        throw new Error(
          "You are currently connected to an unsupported network. Switch to a supported network"
        )
      }

      // StarkNet-specific validations
      if (isStarkNetDeposit) {
        if (!starkNetStatus.isStarkNetReady) {
          throw new Error(
            starkNetStatus.crossChainError ||
              "StarkNet not properly initialized. Please reconnect your wallet and try again."
          )
        }

        // For StarkNet-only connections, we don't need to check EVM compatibility
        // Only check if an EVM wallet is also connected
        if (chainId) {
          // Check network compatibility between EVM and StarkNet
          const compatibility = checkStarkNetNetworkCompatibility(
            chainId,
            starknetChainId || undefined
          )
          if (!compatibility.compatible) {
            throw new Error(
              compatibility.error || "Network compatibility check failed"
            )
          }
        }
      }

      // For StarkNet, use the StarkNet chain name; for EVM, use the chainId
      const chainName = isStarkNetDeposit
        ? nonEVMChainName
        : getChainIdToNetworkName(chainId)
      setSubmitButtonLoading(true)

      let deposit: Deposit

      // CRITICAL: Different chains require different deposit flows
      if (isStarkNetDeposit) {
        // StarkNet requires special flow with proxy and L1Transaction mode
        // DO NOT change this - StarkNet cannot use the standard cross-chain flow
        // The StarkNet address is taken from the connected wallet
        if (!nonEVMPublicKey) {
          throw new Error("StarkNet wallet not connected")
        }
        deposit = await initializeStarkNetDeposit(
          threshold.tbtc,
          nonEVMPublicKey,
          values.btcRecoveryAddress,
          starknetChainId || undefined
        )
      } else if (isL1Network(chainId)) {
        // Standard Ethereum L1 minting
        deposit = await threshold.tbtc.initiateDeposit(
          values.btcRecoveryAddress
        )
      } else if (chainId) {
        // Standard L2 cross-chain flow (Arbitrum, Base, etc.)
        // DO NOT change this - it's working correctly for these chains
        deposit = await threshold.tbtc.initiateCrossChainDeposit(
          values.btcRecoveryAddress,
          chainId as SupportedChainIds
        )
      } else {
        throw new Error("No wallet connected or unsupported network")
      }
      const depositAddress = await threshold.tbtc.calculateDepositAddress()
      const receipt = deposit.getReceipt()

      // update state,
      updateState("ethAddress", values.userWalletAddress)
      updateState("depositor", receipt.depositor.identifierHex.toString())
      updateState("blindingFactor", receipt.blindingFactor.toString())
      updateState("btcRecoveryAddress", values.btcRecoveryAddress)
      updateState("walletPublicKeyHash", receipt.walletPublicKeyHash.toString())
      updateState("refundLocktime", receipt.refundLocktime.toString())
      updateState("extraData", receipt.extraData?.toString())
      updateState("chainName", chainName)

      // create a new deposit address,
      updateState("btcDepositAddress", depositAddress)

      const storageChainId = isStarkNetDeposit
        ? starknetChainId || getStarkNetConfig().chainId
        : chainId

      console.log("ProvideData - saving deposit to localStorage:", {
        isStarkNetDeposit,
        storageChainId,
        chainName,
        depositor: receipt.depositor.identifierHex.toString(),
        userWalletAddress: values.userWalletAddress,
        extraData: receipt.extraData?.toString(),
      })

      setDepositDataInLocalStorage(
        {
          depositor: {
            identifierHex: receipt.depositor.identifierHex.toString(),
          },
          chainName: chainName,
          ethAddress: values.userWalletAddress,
          blindingFactor: receipt.blindingFactor.toString(),
          btcRecoveryAddress: values.btcRecoveryAddress,
          walletPublicKeyHash: receipt.walletPublicKeyHash.toString(),
          refundLocktime: receipt.refundLocktime.toString(),
          btcDepositAddress: depositAddress,
          extraData: receipt.extraData?.toString() || "",
        },
        storageChainId
      )

      depositTelemetry(receipt, depositAddress)

      // if the user has NOT declined the json file, ask the user if they want to accept the new file
      if (shouldDownloadDepositReceipt) {
        const date = new Date().toISOString().split("T")[0]

        const fileName = `${values.userWalletAddress}_${depositAddress}_${date}.json`

        const finalData = {
          depositor: {
            identifierHex: receipt.depositor.identifierHex.toString(),
          },
          networkInfo: {
            chainName: chainName,
            chainId:
              (isStarkNetDeposit
                ? starknetChainId || getStarkNetConfig().chainId
                : chainId
              )?.toString() || "",
            isStarkNetDeposit,
          },
          refundLocktime: receipt.refundLocktime.toString(),
          refundPublicKeyHash: receipt.refundPublicKeyHash.toString(),
          blindingFactor: receipt.blindingFactor.toString(),
          ethAddress: values.userWalletAddress,
          walletPublicKeyHash: receipt.walletPublicKeyHash.toString(),
          btcRecoveryAddress: values.btcRecoveryAddress,
          extraData: receipt.extraData?.toString() ?? "",
        }
        downloadFile(JSON.stringify(finalData), fileName, "text/json")
      }
      updateState("mintingStep", MintingStep.Deposit)
    },
    [
      shouldDownloadDepositReceipt,
      chainId,
      isStarkNetDeposit,
      starkNetStatus,
      nonEVMPublicKey,
      starknetChainId,
      account,
      threshold,
      updateState,
      setDepositDataInLocalStorage,
      depositTelemetry,
    ]
  )

  // Only show special UI for StarkNet
  if (isStarkNetDeposit) {
    if (starkNetStatus.isCrossChainInitializing) {
      return <StarkNetLoadingState />
    }
    if (starkNetStatus.crossChainError) {
      return (
        <StarkNetErrorState
          error={starkNetStatus.crossChainError}
          onRetry={starkNetStatus.retryInitialization}
        />
      )
    }
  }

  return (
    <>
      <BridgeProcessCardTitle onPreviousStepClick={onPreviousStepClick} />
      <BridgeProcessCardSubTitle
        stepText="Step 1"
        subTitle="Generate a Deposit Address"
      />
      <BodyMd color={textColor} mb={12}>
        {isStarkNetDeposit ? (
          <>
            Based on these addresses, the system will generate a unique BTC
            deposit address for you. When you deposit BTC, it will be minted as
            tBTC on Ethereum first, then bridged to your StarkNet wallet. There
            is no limit to the amount you can deposit.
          </>
        ) : (
          <>
            Based on these two addresses, the system will generate a unique BTC
            deposit address for you. There is no limit to the amount you can
            deposit.
          </>
        )}
      </BodyMd>
      <MintingProcessForm
        innerRef={formRef}
        formId="tbtc-minting-data-form"
        initialUserWalletAddress={
          isStarkNetDeposit ? nonEVMPublicKey || "" : account || ""
        }
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

export const ProvideData = withWalletConnection(ProvideDataComponent)
