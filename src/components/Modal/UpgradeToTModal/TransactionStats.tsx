import { FC } from "react"
import { HStack, Stack } from "@chakra-ui/react"
import TokenBalance from "../../TokenBalance"
import { Body3 } from "../../Typography"
import { Token } from "../../../enums"

interface TransactionStatsProps {
  upgradedAmount: string
  receivedAmount: string
  exchangeRate: string
  token: Token
}

const TransactionStats: FC<TransactionStatsProps> = ({
  token,
  upgradedAmount,
  receivedAmount,
  exchangeRate,
}) => {
  const transactionInfo = [
    {
      text: "Upgrade Amount",
      // todo: Token might not be a string, so this should be updated once we decide on the interface
      value: (
        <TokenBalance
          tokenAmount={upgradedAmount}
          withSymbol
          tokenSymbol={token}
        />
      ),
    },
    {
      text: "Receive Amount",
      value: (
        <TokenBalance tokenAmount={receivedAmount} withSymbol tokenSymbol="T" />
      ),
    },
    {
      text: "Exchange Rate",
      value: `1 ${token} = ${exchangeRate} T`,
    },
  ]

  return (
    <Stack spacing="0.5rem">
      {transactionInfo.map((info) => (
        <HStack justify="space-between" key={info.text}>
          <Body3 color="gray.500">{info.text}</Body3>
          <Body3 color="gray.700">{info.value}</Body3>
        </HStack>
      ))}
    </Stack>
  )
}

export default TransactionStats
