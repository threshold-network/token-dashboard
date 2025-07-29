import { FC, useMemo } from "react"
import { BigNumber } from "ethers"
import { parseUnits } from "@ethersproject/units"
import SubmitTxButton from "../../../components/SubmitTxButton"
import { useWeb3React } from "@web3-react/core"
import { useIsActive } from "../../../hooks/useIsActive"
import { useModal } from "../../../hooks/useModal"
import { ModalType } from "../../../enums"
import { BridgeRoute } from "../../../threshold-ts/bridge"
import { BridgeNetwork } from "./NetworkSelector"
import { SupportedChainIds } from "../../../networks/enums/networks"

interface BridgeButtonProps {
  amount: string
  fromNetwork: BridgeNetwork
  toNetwork: BridgeNetwork
  bridgeRoute: BridgeRoute | null
  ccipAllowance: BigNumber
  onBridgeAction?: () => Promise<any>
}

const BridgeButton: FC<BridgeButtonProps> = ({
  amount,
  fromNetwork,
  toNetwork,
  bridgeRoute,
  ccipAllowance,
  onBridgeAction,
}) => {
  const { account, active } = useWeb3React()
  const { chainId, switchNetwork } = useIsActive()
  const { openModal } = useModal()

  // Parse amount safely
  const amountBN = useMemo(() => {
    try {
      return amount ? parseUnits(amount, 18) : BigNumber.from(0)
    } catch {
      return BigNumber.from(0)
    }
  }, [amount])

  // Helper function to get network name
  const getNetworkName = (chainId: BridgeNetwork): string => {
    switch (chainId) {
      case SupportedChainIds.Ethereum:
        return "Ethereum"
      case SupportedChainIds.Sepolia:
        return "Sepolia"
      case SupportedChainIds.Bob:
        return "BOB"
      case SupportedChainIds.BobSepolia:
        return "BOB Sepolia"
      default:
        return "Unknown"
    }
  }

  // Determine button state and text
  const buttonState = useMemo(() => {
    // Not connected
    if (!active || !account) {
      return {
        text: "Connect Wallet",
        disabled: false,
        onClick: () => openModal(ModalType.SelectWallet),
      }
    }

    // Wrong network
    if (chainId !== fromNetwork) {
      return {
        text: `Switch to ${getNetworkName(fromNetwork)}`,
        disabled: false,
        onClick: () => switchNetwork(fromNetwork),
      }
    }

    // No amount entered
    if (!amount || amountBN.eq(0)) {
      return {
        text: "Enter Amount",
        disabled: true,
        onClick: () => {},
      }
    }

    // Check if CCIP approval needed (only for CCIP route)
    const needsCCIPApproval =
      bridgeRoute === "ccip" && ccipAllowance.lt(amountBN)

    if (needsCCIPApproval) {
      return {
        text: "Approve CCIP",
        disabled: false,
        onClick: () => {
          // This will be handled by the submit button's onSubmit
        },
      }
    }

    // Ready to bridge
    return {
      text: "Bridge Asset",
      disabled: false,
      onClick: () => {
        // This will be handled by the submit button's onSubmit
      },
    }
  }, [
    active,
    account,
    chainId,
    fromNetwork,
    amount,
    amountBN,
    bridgeRoute,
    ccipAllowance,
    openModal,
    switchNetwork,
  ])

  const handleSubmit = async () => {
    // Handle different button states
    if (!active || !account) {
      openModal(ModalType.SelectWallet)
      return
    }

    if (chainId !== fromNetwork) {
      switchNetwork(fromNetwork)
      return
    }

    // Execute the bridge action
    if (onBridgeAction) {
      await onBridgeAction()
    }
  }

  return (
    <SubmitTxButton
      isFullWidth
      onSubmit={handleSubmit}
      isDisabled={buttonState.disabled}
    >
      {buttonState.text}
    </SubmitTxButton>
  )
}

export default BridgeButton
