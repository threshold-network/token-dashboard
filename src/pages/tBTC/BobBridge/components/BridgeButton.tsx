import { FC, useMemo, useState, useCallback } from "react"
import { BigNumber } from "ethers"
import { parseUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { useIsActive } from "../../../../hooks/useIsActive"
import { useModal } from "../../../../hooks/useModal"
import { ModalType } from "../../../../enums"
import { BridgeRoute } from "../../../../threshold-ts/bridge"
import { BridgeNetwork } from "./NetworkSelector"
import { SupportedChainIds } from "../../../../networks/enums/networks"
import SubmitTxButton from "../../../../components/SubmitTxButton"
import { useTokenBalance } from "../../../../hooks/useTokenBalance"
import { Token } from "../../../../enums"

interface BridgeButtonProps {
  amount: string
  fromNetwork: BridgeNetwork
  toNetwork: BridgeNetwork
  bridgeRoute: BridgeRoute | null
  ccipAllowance: BigNumber
  onBridgeAction?: () => Promise<any>
  isLoading?: boolean
}

const BridgeButton: FC<BridgeButtonProps> = ({
  amount,
  fromNetwork,
  toNetwork,
  bridgeRoute,
  ccipAllowance,
  onBridgeAction,
  isLoading = false,
}) => {
  const { account, active } = useWeb3React()
  const { chainId, switchNetwork } = useIsActive()
  const { openModal } = useModal()
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false)
  const balance = useTokenBalance(Token.TBTCV2)

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

  // Handle network switching
  const handleNetworkSwitch = useCallback(async () => {
    try {
      setIsSwitchingNetwork(true)
      await switchNetwork(fromNetwork)
    } catch (error) {
      console.error("Failed to switch network:", error)
    } finally {
      setIsSwitchingNetwork(false)
    }
  }, [fromNetwork, switchNetwork])

  // Determine button state and text
  const buttonState = useMemo(() => {
    // Not connected
    if (!active || !account) {
      return {
        text: "Connect Wallet",
        disabled: false,
        isLoading: false,
        onClick: () => openModal(ModalType.SelectWallet),
      }
    }

    // Wrong network
    if (chainId !== fromNetwork) {
      return {
        text: isSwitchingNetwork
          ? "Switching Network..."
          : `Switch to ${getNetworkName(fromNetwork)}`,
        disabled: isSwitchingNetwork,
        isLoading: isSwitchingNetwork,
        onClick: handleNetworkSwitch,
      }
    }

    // No amount entered
    if (!amount || amountBN.eq(0)) {
      return {
        text: "Enter Amount",
        disabled: true,
        isLoading: false,
        onClick: () => {},
      }
    }

    // Check if amount exceeds balance
    if (amountBN.gt(balance)) {
      return {
        text: "Insufficient Balance",
        disabled: true,
        isLoading: false,
        onClick: () => {},
      }
    }

    // Check if CCIP approval needed (only for CCIP route)
    const needsCCIPApproval =
      bridgeRoute === "ccip" && ccipAllowance.lt(amountBN)

    if (needsCCIPApproval) {
      return {
        text: isLoading ? "Approving..." : "Approve CCIP",
        disabled: isLoading,
        isLoading: isLoading,
        onClick: onBridgeAction || (() => {}),
      }
    }

    // Ready to bridge
    return {
      text: isLoading ? "Bridging..." : "Bridge Asset",
      disabled: isLoading,
      isLoading: isLoading,
      onClick: onBridgeAction || (() => {}),
    }
  }, [
    active,
    account,
    chainId,
    fromNetwork,
    amount,
    amountBN,
    balance,
    bridgeRoute,
    ccipAllowance,
    openModal,
    isSwitchingNetwork,
    handleNetworkSwitch,
    onBridgeAction,
    isLoading,
  ])

  return (
    <SubmitTxButton
      isFullWidth
      onSubmit={buttonState.onClick}
      isDisabled={buttonState.disabled}
      isLoading={buttonState.isLoading}
    >
      {buttonState.text}
    </SubmitTxButton>
  )
}

export default BridgeButton
