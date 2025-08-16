import { FC, useCallback, useState } from "react"
import { Stack } from "@chakra-ui/react"
import { Card, H5 } from "@threshold-network/components"
import NetworkSelector from "./NetworkSelector"
import BridgeTypeSelector from "./BridgeTypeSelector"
import BridgeAmountInput from "./BridgeAmountInput"
import BridgeFees from "./BridgeFees"
import BridgeButton from "./BridgeButton"
import { useBridge } from "../../../../hooks/tbtc/useBridge"
import { parseUnits } from "@ethersproject/units"
import { useModal } from "../../../../hooks/useModal"
import BridgeTxAlert from "./BridgeTxAlert"
import { ModalType } from "../../../../enums"

interface BridgePanelProps {
  onBridgeSuccess?: () => void
}

const BridgePanel: FC<BridgePanelProps> = ({ onBridgeSuccess }) => {
  const {
    fromNetwork,
    toNetwork,
    bridgeRoute,
    amount,
    setAmount,
    swapNetworks,
    setFromNetwork,
    setToNetwork,
    ccipAllowance,
    quote,
    isLoadingQuote,
    bridgingTime,
    executeBridge,
    approveCcip,
    updateCcipAllowance,
  } = useBridge()

  const { openModal } = useModal()
  const [isTransacting, setIsTransacting] = useState(false)
  const [successTx, setSuccessTx] = useState<{
    hash: string
    route: "ccip" | "standard"
  } | null>(null)

  const handleBridgeExecution = useCallback(async () => {
    setIsTransacting(true)
    try {
      const bridgeTx = await executeBridge()
      if (bridgeTx) {
        setSuccessTx({
          hash: bridgeTx.hash,
          route: bridgeRoute as "ccip" | "standard",
        })
        // Wait a bit for the transaction to be indexed
        setTimeout(() => {
          onBridgeSuccess?.()
        }, 3000)
      }
      return bridgeTx
    } catch (error) {
      console.error("Bridge execution failed:", error)
      throw error
    } finally {
      setIsTransacting(false)
    }
  }, [executeBridge, bridgeRoute, onBridgeSuccess])

  const handleBridgeAction = useCallback(async () => {
    if (!amount || isTransacting) return

    setIsTransacting(true)
    try {
      const amountBN = parseUnits(amount, 18)

      // Check if CCIP approval is needed
      if (bridgeRoute === "ccip" && ccipAllowance.lt(amountBN)) {
        const tx = await approveCcip()
        if (tx) {
          await tx.wait()
          console.log("tx: ", tx)
          // Update allowance after approval
          await updateCcipAllowance()
          // Don't execute bridge here - let user click again after approval
          return tx
        }
      } else {
        // Open confirmation modal
        openModal(ModalType.InitiateBridging, {
          amount,
          fromNetwork:
            fromNetwork === 1
              ? "Ethereum"
              : fromNetwork === 11155111
              ? "Ethereum Sepolia"
              : fromNetwork === 60808
              ? "BOB"
              : "BOB Sepolia",
          toNetwork:
            toNetwork === 1
              ? "Ethereum"
              : toNetwork === 11155111
              ? "Ethereum Sepolia"
              : toNetwork === 60808
              ? "BOB"
              : "BOB Sepolia",
          bridgeRoute,
          estimatedFee: quote?.fee || null,
          estimatedTime: bridgingTime || 0,
          onConfirm: handleBridgeExecution,
        })
      }
    } catch (error) {
      console.error("Bridge action failed:", error)
      throw error
    } finally {
      setIsTransacting(false)
    }
  }, [
    amount,
    bridgeRoute,
    ccipAllowance,
    approveCcip,
    updateCcipAllowance,
    isTransacting,
    openModal,
    fromNetwork,
    toNetwork,
    quote,
    bridgingTime,
    handleBridgeExecution,
  ])

  return (
    <Card maxW="600px">
      <Stack spacing={8}>
        <H5>tBTC Bridge</H5>

        {successTx && <BridgeTxAlert tx={successTx} />}

        <NetworkSelector
          fromNetwork={fromNetwork}
          toNetwork={toNetwork}
          onSwap={swapNetworks}
          onFromNetworkChange={setFromNetwork}
          onToNetworkChange={setToNetwork}
        />
        <BridgeTypeSelector
          fromNetwork={fromNetwork}
          toNetwork={toNetwork}
          bridgeRoute={bridgeRoute}
          bridgingTime={bridgingTime ?? undefined}
        />
        <BridgeAmountInput
          amount={amount}
          onChange={setAmount}
          tokenSymbol="tBTC"
        />
        <BridgeFees
          quote={quote}
          isLoading={isLoadingQuote}
          fromNetwork={fromNetwork}
          toNetwork={toNetwork}
        />

        <BridgeButton
          amount={amount}
          fromNetwork={fromNetwork}
          toNetwork={toNetwork}
          bridgeRoute={bridgeRoute}
          ccipAllowance={ccipAllowance}
          onBridgeAction={handleBridgeAction}
          isLoading={isTransacting}
          size="lg"
        />
      </Stack>
    </Card>
  )
}

export default BridgePanel
