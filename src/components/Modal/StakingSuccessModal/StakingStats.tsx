import { FC } from "react"
import TokenBalance from "../../TokenBalance"
import { Body3 } from "../../Typography"
import shortenAddress from "../../../utils/shortenAddress"
import TransactionInfoTable, {
  TransactionInfo,
} from "../../TransactionInfoTable"

interface StakingStatsProps {
  stakeAmount: string | number
  operator: string
  beneficiary: string
  authorizer: string
}

const StakingStats: FC<StakingStatsProps> = ({
  stakeAmount,
  operator,
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
          color="gray.700"
        />
      ),
    },
    {
      text: "Operator",
      value: <Body3 color="gray.700">{shortenAddress(operator)}</Body3>,
    },
    {
      text: "Beneficiary",
      value: <Body3 color="gray.700">{shortenAddress(beneficiary)}</Body3>,
    },
    {
      text: "Authorizer",
      value: <Body3 color="gray.700">{shortenAddress(authorizer)}</Body3>,
    },
  ]

  return <TransactionInfoTable transactionInfo={transactionInfo} />
}

export default StakingStats
