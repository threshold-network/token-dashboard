import { FC } from "react"
import { HStack, Stack } from "@chakra-ui/react"
import { BodySm } from "@threshold-network/components"

export interface TransactionInfo {
  text: string
  value: JSX.Element
}

const TransactionInfoTable: FC<{ transactionInfo: TransactionInfo[] }> = ({
  transactionInfo,
}) => {
  return (
    <Stack spacing="0.5rem" marginTop={6}>
      {transactionInfo.map((info) => (
        <HStack justify="space-between" key={info.text}>
          <BodySm>{info.text}</BodySm>
          {info.value}
        </HStack>
      ))}
    </Stack>
  )
}

export default TransactionInfoTable
