import { FC } from "react"
import { List, Tooltip, Box } from "@chakra-ui/react"
import { TransactionDetailsItem } from "../../../../components/TransactionDetails"
import { BridgeQuote } from "../../../../threshold-ts/bridge"
import { BridgeNetwork } from "./NetworkSelector"
import { formatUnits } from "@ethersproject/units"
import { SupportedChainIds } from "../../../../networks/enums/networks"
import { BigNumber } from "ethers"
import { BodySm } from "@threshold-network/components"

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

  // Helper to format fee from BigNumber to decimal string
  const formatFee = (fee: any): { display: string; full: string } => {
    if (!fee) return { display: "0 ETH", full: "0 ETH" }

    try {
      let feeValue: string

      // Handle BigNumber with _hex property
      if (fee._hex) {
        feeValue = fee._hex
      } else if (fee.hex) {
        feeValue = fee.hex
      } else if (typeof fee === "string") {
        feeValue = fee
      } else {
        feeValue = fee.toString()
      }

      // Convert to decimal string with 18 decimals
      const formatted = formatUnits(feeValue, 18)
      const numValue = parseFloat(formatted)

      let display: string
      if (numValue === 0) {
        display = "0 ETH"
      } else if (numValue < 0.000001) {
        display = "< 0.000001 ETH"
      } else if (numValue < 0.001) {
        display = `${numValue.toFixed(6)} ETH`
      } else if (numValue < 1) {
        display = `${numValue.toFixed(4)} ETH`
      } else {
        display = `${numValue.toFixed(2)} ETH`
      }

      return {
        display,
        full: `${formatted} ETH`,
      }
    } catch (error) {
      console.error("Error formatting fee:", error, fee)
      return { display: "0 ETH", full: "0 ETH" }
    }
  }

  const FeeDisplay: FC<{ fee: any }> = ({ fee }) => {
    const { display, full } = formatFee(fee)
    return (
      <Tooltip label={full} placement="top" hasArrow>
        <Box as="span" cursor="pointer" display="inline-block">
          <BodySm>{display}</BodySm>
        </Box>
      </Tooltip>
    )
  }

  return (
    <List spacing="2">
      <TransactionDetailsItem
        label={isDeposit ? "Deposit Fee" : "Withdrawal Fee"}
      >
        {quote ? (
          <FeeDisplay fee={quote.fee} />
        ) : isLoading ? (
          <BodySm>Loading...</BodySm>
        ) : (
          <BodySm>0 ETH</BodySm>
        )}
      </TransactionDetailsItem>

      {quote?.route === "ccip" && quote.breakdown?.ccipFee && (
        <TransactionDetailsItem label="CCIP Service Fee">
          <FeeDisplay fee={quote.breakdown.ccipFee} />
        </TransactionDetailsItem>
      )}

      {quote?.route === "standard" && quote.breakdown?.standardFee && (
        <TransactionDetailsItem label="Gas Estimate">
          <FeeDisplay fee={quote.breakdown.standardFee} />
        </TransactionDetailsItem>
      )}
    </List>
  )
}

export default BridgeFees
