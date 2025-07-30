import { FC } from "react"
import { List, Skeleton } from "@chakra-ui/react"
import { TransactionDetailsAmountItem } from "../../../../components/TransactionDetails"
import { BridgeQuote } from "../../../../threshold-ts/bridge"
import { BridgeNetwork } from "./NetworkSelector"
import { formatUnits } from "@ethersproject/units"
import { SupportedChainIds } from "../../../../networks/enums/networks"

interface BridgeFeesProps {
  quote: BridgeQuote | null
  isLoading: boolean
  fromNetwork: BridgeNetwork
  toNetwork: BridgeNetwork
}

const BridgeFees: FC<BridgeFeesProps> = ({
  quote,
  isLoading,
  fromNetwork,
  toNetwork,
}) => {
  // Determine if this is a deposit or withdrawal
  const isDeposit =
    (fromNetwork === SupportedChainIds.Ethereum ||
      fromNetwork === SupportedChainIds.Sepolia) &&
    (toNetwork === SupportedChainIds.Bob ||
      toNetwork === SupportedChainIds.BobSepolia)

  const formatFee = (fee?: any): string => {
    if (!fee) return "0"
    try {
      // Assuming fee is in wei (18 decimals) for ETH
      return formatUnits(fee, 18)
    } catch {
      return "0"
    }
  }

  return (
    <List spacing="2">
      <TransactionDetailsAmountItem
        label={isDeposit ? "Deposit Fee" : "Withdrawal Fee"}
        amount={quote ? formatFee(quote.fee) : "0"}
        suffixItem="ETH"
        isFetching={isLoading}
      />

      {quote?.route === "ccip" && quote.breakdown?.ccipFee && (
        <TransactionDetailsAmountItem
          label="CCIP Service Fee"
          amount={formatFee(quote.breakdown.ccipFee)}
          suffixItem="ETH"
          isFetching={isLoading}
        />
      )}

      {quote?.route === "standard" && quote.breakdown?.standardFee && (
        <TransactionDetailsAmountItem
          label="Gas Estimate"
          amount={formatFee(quote.breakdown.standardFee)}
          suffixItem="ETH"
          isFetching={isLoading}
        />
      )}
    </List>
  )
}

export default BridgeFees
