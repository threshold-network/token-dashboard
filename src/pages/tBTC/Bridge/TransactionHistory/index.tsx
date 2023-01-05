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
import emptyHistoryImageSrcDark from "../../../../static/images/tBTC-bridge-no-history-dark.svg"
import emptyHistoryImageSrcLight from "../../../../static/images/tBTC-bridge-no-history-light.svg"

const txResultToBadgeProps: Record<
  TbtcTransactionResult,
  { colorScheme: string }
> = {
  [TbtcTransactionResult.MINTED]: {
    colorScheme: "green",
  },
  [TbtcTransactionResult.UNMINTED]: {
    colorScheme: "green",
  },
  [TbtcTransactionResult.PENDING]: {
    colorScheme: "yellow",
  },
  [TbtcTransactionResult.ERROR]: {
    colorScheme: "red",
  },
}

const TbtcActionBadge: FC<{ result: TbtcTransactionResult }> = ({ result }) => {
  return (
    <Badge variant="subtle" {...txResultToBadgeProps[result]} size="sm">
      {result}
    </Badge>
  )
}

export const TransactionHistory: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  const epmtyHistoryImg = useColorModeValue(
    emptyHistoryImageSrcLight,
    emptyHistoryImageSrcDark
  )
  const history: {
    amount: number
    action: TbtcTransactionResult
  }[] = [
    // {
    //   amount: 0.4,
    //   action: TbtcTransactionResult.PENDING,
    // },
    // {
    //   amount: 1.2,
    //   action: TbtcTransactionResult.UNMINTED,
    // },
    // {
    //   amount: 15,
    //   action: TbtcTransactionResult.ERROR,
    // },
    // {
    //   amount: 13.54,
    //   action: TbtcTransactionResult.MINTED,
    // },
    // {
    //   amount: 23.45,
    //   action: TbtcTransactionResult.MINTED,
    // },
    // {
    //   amount: 11.2,
    //   action: TbtcTransactionResult.MINTED,
    // },
  ]

  const isHistoryEmpty = history.length === 0

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
        <BodySm as={Tbody}>
          {isHistoryEmpty ? (
            <EmptyHistoryTableBody />
          ) : (
            history.map((tx, index) => (
              <Tr key={index}>
                <Td py={4} px={2}>
                  {tx.amount}
                </Td>
                <Td py={4} px={2} isNumeric>
                  <TbtcActionBadge result={tx.action} />
                </Td>
              </Tr>
            ))
          )}
        </BodySm>
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
