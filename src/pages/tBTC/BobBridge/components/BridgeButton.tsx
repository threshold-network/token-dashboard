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
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false)

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

    // Check if CCIP approval needed (only for CCIP route)
    const needsCCIPApproval =
      bridgeRoute === "ccip" && ccipAllowance.lt(amountBN)

    if (needsCCIPApproval) {
      return {
        text: "Approve CCIP",
        disabled: false,
        isLoading: false,
        onClick: onBridgeAction || (() => {}),
      }
    }

    // Ready to bridge
    return {
      text: "Bridge Asset",
      disabled: false,
      isLoading: false,
      onClick: onBridgeAction || (() => {}),
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
    isSwitchingNetwork,
    handleNetworkSwitch,
    onBridgeAction,
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
