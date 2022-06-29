import { ComponentProps, FC } from "react"
import {
  Badge,
  BodySm,
  Card,
  LabelSm,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@threshold-network/components"
import { TbtcTransactionResult } from "../../../../types/tbtc"

const TbtcActionBadge: FC<{ result: TbtcTransactionResult }> = ({ result }) => {
  switch (result) {
    case TbtcTransactionResult.MINTED:
      return (
        <Badge variant="subtle" colorScheme="green">
          MINTED
        </Badge>
      )
    case TbtcTransactionResult.UNMINTED:
      return (
        <Badge variant="subtle" colorScheme="green">
          UNMINTED
        </Badge>
      )
    case TbtcTransactionResult.ERROR:
      return (
        <Badge variant="subtle" colorScheme="red">
          ERROR
        </Badge>
      )
    case TbtcTransactionResult.PENDING:
      return (
        <Badge variant="subtle" colorScheme="yellow">
          PENDING
        </Badge>
      )
  }
  return <BodySm>--</BodySm>
}

export const TransactionHistory: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  // TODO: this should be pulled from a central store
  const TbtcTransactionsHistory: {
    amount: number
    action: TbtcTransactionResult
  }[] = [
    {
      amount: 0.4,
      action: TbtcTransactionResult.PENDING,
    },
    {
      amount: 1.2,
      action: TbtcTransactionResult.UNMINTED,
    },
    {
      amount: 15,
      action: TbtcTransactionResult.ERROR,
    },
    {
      amount: 13.54,
      action: TbtcTransactionResult.MINTED,
    },
    {
      amount: 23.45,
      action: TbtcTransactionResult.MINTED,
    },
    {
      amount: 11.2,
      action: TbtcTransactionResult.MINTED,
    },
  ]

  return (
    <Card {...props} minH="530px">
      <LabelSm mb="5">tx history</LabelSm>
      <Table>
        <Thead>
          <Tr>
            <Th>TBTC</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {TbtcTransactionsHistory.map((tx, index) => (
            <Tr key={index}>
              <Td py={4} px={2}>
                {tx.amount}
              </Td>
              <Td py={4} px={2} isNumeric>
                <TbtcActionBadge result={tx.action} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Card>
  )
}
