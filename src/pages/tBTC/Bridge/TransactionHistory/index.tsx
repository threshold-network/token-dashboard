import { ComponentProps, FC } from "react"
import {
  Badge,
  BodyMd,
  BodySm,
  Card,
  Image,
  LabelSm,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@threshold-network/components"
import { TbtcTransactionResult } from "../../../../types/tbtc"
import { BridgeHistoryStatus } from "../../../../threshold-ts/tbtc"

// TODO: we refactored the `TbtcActionBadge` component in
// https://github.com/threshold-network/token-dashboard/pull/329, once we merge
// this PR we should update it to render status based on the
// `BridgeHistoryStatus` enum.
const TbtcActionBadge: FC<{ result: TbtcTransactionResult }> = ({ result }) => {
  return (
    <Badge variant="subtle" {...txResultToBadgeProps[result]} size="sm">
      {result}
    </Badge>
  )
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
          <Tr color="gray.500">
            <LabelSm as={Th} paddingInlineStart="2" paddingInlineEnd="2">
              TBTC
            </LabelSm>
            <LabelSm
              as={Th}
              textAlign="right"
              paddingInlineStart="2"
              paddingInlineEnd="2"
            >
              Action
            </LabelSm>
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

      {isHistoryEmpty && (
        <>
          <Image
            alt="no-history"
            src={epmtyHistoryImg}
            mx="auto"
            mt={16}
            mb={4}
          />
          <BodyMd textAlign="center">You have no history yet.</BodyMd>
        </>
      )}
    </Card>
  )
}

const EmptyRow = () => (
  <Tr>
    <Td py={4} px={2}>
      -.--
    </Td>
    <Td py={4} px={2} isNumeric></Td>
  </Tr>
)

const EmptyHistoryTableBody = () => {
  return (
    <>
      <EmptyRow />
      <EmptyRow />
    </>
  )
}
