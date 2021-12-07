import numeral from "numeral"
import { HStack, Stack } from "@chakra-ui/react"
import { Body3 } from "../../Typography"
import { Token } from "../../../enums"
import { FC } from "react"

interface TransactionStatsProps {
  upgradedAmount: number
  receivedAmount: number
  exchangeRate: number
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
      value: `${numeral(upgradedAmount).format("0,00.00")} ${token}`,
    },
    {
      text: "Receive Amount",
      value: `${numeral(receivedAmount).format("0,00.00")} T`,
    },
    {
      text: "Exchange Rate",
      value: `1 ${token} = ${exchangeRate} T`,
    },
  ]

  return (
    <Stack spacing={4} mb={12}>
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
