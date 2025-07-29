import { FC, useCallback } from "react"
import { Stack } from "@chakra-ui/react"
import { Card, H5 } from "@threshold-network/components"
import NetworkSelector from "./NetworkSelector"
import BridgeTypeSelector from "./BridgeTypeSelector"
import BridgeAmountInput from "./BridgeAmountInput"
import BridgeFees from "./BridgeFees"
import BridgeButton from "./BridgeButton"
import { useBridge } from "../../../hooks/tbtc/useBridge"
import { parseUnits } from "@ethersproject/units"
import { BigNumber } from "ethers"

const BridgePanel: FC = () => {
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
    executeBridge,
    approveCcip,
  } = useBridge()

  const handleBridgeAction = useCallback(async () => {
    if (!amount) return

    try {
      const amountBN = parseUnits(amount, 18)

      // Check if CCIP approval is needed
      if (bridgeRoute === "ccip" && ccipAllowance.lt(amountBN)) {
        const tx = await approveCcip()
        if (tx) {
          await tx.wait()
          // After approval, execute the bridge
          const bridgeTx = await executeBridge()
          return bridgeTx
        }
      } else {
        // Direct bridge execution
        const bridgeTx = await executeBridge()
        return bridgeTx
      }
    } catch (error) {
      console.error("Bridge action failed:", error)
      throw error
    }
  }, [amount, bridgeRoute, ccipAllowance, approveCcip, executeBridge])

  return (
    <Card maxW="720px">
      <Stack spacing={8}>
        <H5>tBTC Bridge</H5>

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
          withdrawalTime={quote?.estimatedTime}
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
        />
      </Stack>
    </Card>
  )
}

export default BridgePanel
