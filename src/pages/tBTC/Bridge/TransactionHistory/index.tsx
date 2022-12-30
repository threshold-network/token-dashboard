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
import { BridgeHistoryStatus } from "../../../../threshold-ts/tbtc"

// TODO: we refactored the `TbtcActionBadge` component in
// https://github.com/threshold-network/token-dashboard/pull/329, once we merge
// this PR we should update it to render status based on the
// `BridgeHistoryStatus` enum.
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

// TODO: Add a new TX column and render link to a block explorer once we merge
// https://github.com/threshold-network/token-dashboard/pull/329.
export const TransactionHistory: FC<
  ComponentProps<typeof Card> & {
    data: { amount: string; status: BridgeHistoryStatus; txHash: string }[]
  }
> = ({ data, ...props }) => {
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
          {data.map((_data) => (
            <Tr key={_data.txHash}>
              <Td py={4} px={2}>
                {_data.amount}
              </Td>
              <Td py={4} px={2} isNumeric>
                {_data.status}
                {/* <TbtcActionBadge result={_data.status} /> */}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Card>
  )
}
