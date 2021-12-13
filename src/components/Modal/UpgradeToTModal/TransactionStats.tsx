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
          as="p"
          fontSize="sm"
          color="gray.700"
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
          color="gray.700"
        />
      ),
    },
    {
      text: "Exchange Rate",
      value: <Body3 color="gray.700">{`1 ${token} = ${exchangeRate} T`}</Body3>,
    },
  ]

  return (
    <Stack spacing="0.5rem">
      {transactionInfo.map((info) => (
        <HStack justify="space-between" key={info.text}>
          <Body3 color="gray.500">{info.text}</Body3>
          {info.value}
        </HStack>
      ))}
    </Stack>
  )
}

export default TransactionStats
