import { FC } from "react"
import TokenBalance from "../../TokenBalance"
import { BodySm } from "@threshold-network/components"
import { Token } from "../../../enums"
import TransactionInfoTable, {
  TransactionInfo,
} from "../../TransactionInfoTable"

interface TransactionStatsProps {
  upgradedAmount: string
  receivedAmount: string
  exchangeRate: string
  token: Token
}

const UpgradeStats: FC<TransactionStatsProps> = ({
  token,
  upgradedAmount,
  receivedAmount,
  exchangeRate,
}) => {
  const transactionInfo: TransactionInfo[] = [
    {
      text: "Upgrade Amount",
      // todo: Token might not be a string, so this should be updated once we decide on the interface
      value: (
        <TokenBalance
          tokenAmount={upgradedAmount}
          withSymbol
          tokenSymbol={token}
          as="p"
          fontSize="sm"
        />
      ),
    },
    {
      text: "Receive Amount",
      value: (
        <TokenBalance
          tokenAmount={receivedAmount}
          withSymbol
          tokenSymbol="T"
          as="p"
          fontSize="sm"
        />
      ),
    },
    {
      text: "Exchange Rate",
      value: <BodySm>{`1 ${token} = ${exchangeRate} T`}</BodySm>,
    },
  ]

  return <TransactionInfoTable transactionInfo={transactionInfo} />
}

export default UpgradeStats
