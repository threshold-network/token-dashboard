import { FC } from "react"
import TokenBalance from "../TokenBalance"
import { BodySm } from "@threshold-network/components"
import TransactionInfoTable, { TransactionInfo } from "../TransactionInfoTable"
import shortenAddress from "../../utils/shortenAddress"

interface StakingStatsProps {
  stakeAmount: string | number
  stakingProvider: string
  beneficiary: string
  authorizer: string
}

const StakingStats: FC<StakingStatsProps> = ({
  stakeAmount,
  stakingProvider,
  beneficiary,
  authorizer,
}) => {
  const transactionInfo: TransactionInfo[] = [
    {
      text: "Stake Amount",
      // todo: Token might not be a string, so this should be updated once we decide on the interface
      value: (
        <TokenBalance
          tokenAmount={stakeAmount}
          withSymbol
          tokenSymbol="T"
          as="p"
          fontSize="sm"
        />
      ),
    },
    {
      text: "Operator",
      value: <BodySm>{shortenAddress(stakingProvider)}</BodySm>,
    },
    {
      text: "Beneficiary",
      value: <BodySm>{shortenAddress(beneficiary)}</BodySm>,
    },
    {
      text: "Authorizer",
      value: <BodySm>{shortenAddress(authorizer)}</BodySm>,
    },
  ]

  return <TransactionInfoTable transactionInfo={transactionInfo} />
}

export default StakingStats
