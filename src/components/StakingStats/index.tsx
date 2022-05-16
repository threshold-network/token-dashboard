import { FC } from "react"
import TokenBalance from "../TokenBalance"
import { Body3 } from "../Typography"
import TransactionInfoTable, { TransactionInfo } from "../TransactionInfoTable"
import shortenAddress from "../../utils/shortenAddress"

interface StakingStatsProps {
  stakeAmount: string | number
  amountText?: string
  stakingProvider: string
  beneficiary: string
  authorizer: string
}

const StakingStats: FC<StakingStatsProps> = ({
  stakeAmount,
  stakingProvider,
  beneficiary,
  authorizer,
  amountText = "Staked Amount",
}) => {
  const transactionInfo: TransactionInfo[] = [
    {
      text: amountText,
      // todo: Token might not be a string, so this should be updated once we decide on the interface
      value: (
        <TokenBalance
          tokenAmount={stakeAmount}
          withSymbol
          tokenSymbol="T"
          as="p"
          fontSize="sm"
          lineHeight="unset"
          fontWeight="400"
        />
      ),
    },
    {
      text: "Provider Address",
      value: <Body3>{shortenAddress(stakingProvider)}</Body3>,
    },
    {
      text: "Beneficiary Address",
      value: <Body3>{shortenAddress(beneficiary)}</Body3>,
    },
    {
      text: "Authorizer Address",
      value: <Body3>{shortenAddress(authorizer)}</Body3>,
    },
  ]

  return <TransactionInfoTable transactionInfo={transactionInfo} />
}

export default StakingStats
