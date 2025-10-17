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
import { BridgeActivity } from "../../../../threshold-ts/bridge"

interface BridgePanelProps {
  onBridgeSuccess?: () => void
  onBridgeSubmitted?: (activity: BridgeActivity) => void
}

const BridgePanel: FC<BridgePanelProps> = ({
  onBridgeSuccess,
  onBridgeSubmitted,
}) => {
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
        // Optimistically add activity entry immediately after submission
        if (
          onBridgeSubmitted &&
          amount &&
          bridgeRoute &&
          fromNetwork &&
          toNetwork
        ) {
          const toNetworkName = (id: number) =>
            id === 1
              ? "Ethereum"
              : id === 11155111
              ? "Ethereum Sepolia"
              : id === 60808
              ? "BOB"
              : id === 808813
              ? "BOB Sepolia"
              : "Unknown"

          const optimistic: BridgeActivity = {
            amount: parseUnits(amount, 18).toString(),
            status: "PENDING",
            activityKey: `optimistic-${bridgeRoute}-${bridgeTx.hash}`,
            bridgeRoute: bridgeRoute,
            fromNetwork: toNetworkName(fromNetwork),
            toNetwork: toNetworkName(toNetwork),
            txHash: bridgeTx.hash,
            timestamp: Math.floor(Date.now() / 1000),
            explorerUrl:
              bridgeRoute === "ccip"
                ? `https://ccip.chain.link/tx/${bridgeTx.hash}`
                : fromNetwork === 60808
                ? `https://explorer.gobob.xyz/tx/${bridgeTx.hash}`
                : `https://bob-sepolia.explorer.gobob.xyz/tx/${bridgeTx.hash}`,
          }
          onBridgeSubmitted(optimistic)
        }
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
