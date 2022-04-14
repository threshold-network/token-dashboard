import { FC } from "react"
import { HStack, Stack } from "@chakra-ui/react"
import { Body3 } from "@threshold-network/components"

export interface TransactionInfo {
  text: string
  value: JSX.Element
}

const TransactionInfoTable: FC<{ transactionInfo: TransactionInfo[] }> = ({
  transactionInfo,
}) => {
  return (
    <Stack spacing="0.5rem">
      {transactionInfo.map((info) => (
        <HStack justify="space-between" key={info.text}>
          <Body3>{info.text}</Body3>
          {info.value}
        </HStack>
      ))}
    </Stack>
  )
}

export default TransactionInfoTable
