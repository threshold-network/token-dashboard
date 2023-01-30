import { ComponentProps, FC } from "react"
import {
  Badge,
  BodyMd,
  BodySm,
  Card,
  Image,
  LabelSm,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@threshold-network/components"
import { BridgeHistoryStatus } from "../../../../threshold-ts/tbtc"
import emptyHistoryImageSrcDark from "../../../../static/images/tBTC-bridge-no-history-dark.svg"
import emptyHistoryImageSrcLight from "../../../../static/images/tBTC-bridge-no-history-light.svg"
import ViewInBlockExplorer from "../../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../../utils/createEtherscanLink"
import { InlineTokenBalance } from "../../../../components/TokenBalance"

const bridgeTxHistoryStatusToBadgeProps: Record<
  BridgeHistoryStatus,
  { colorScheme: string }
> = {
  [BridgeHistoryStatus.MINTED]: {
    colorScheme: "green",
  },
  [BridgeHistoryStatus.PENDING]: {
    colorScheme: "yellow",
  },
  [BridgeHistoryStatus.ERROR]: {
    colorScheme: "red",
  },
}

const TbtcActionBadge: FC<{ status: BridgeHistoryStatus }> = ({ status }) => {
  return (
    <Badge
      variant="subtle"
      {...bridgeTxHistoryStatusToBadgeProps[status]}
      size="sm"
    >
      {status}
    </Badge>
  )
}

export const TransactionHistoryCard: FC<ComponentProps<typeof Card>> = ({
  children,
  ...props
}) => {
  return (
    <Card {...props} minH="530px">
      <LabelSm mb="5">tx history</LabelSm>
      {children}
    </Card>
  )
}

export const TransactionHistoryTable: FC<{
  data: { amount: string; status: BridgeHistoryStatus; txHash: string }[]
}> = ({ data }) => {
  const epmtyHistoryImg = useColorModeValue(
    emptyHistoryImageSrcLight,
    emptyHistoryImageSrcDark
  )

  const isHistoryEmpty = data.length === 0

  return (
    <>
      <Table>
        <Thead>
          <Tr color="gray.500">
            <LabelSm as={Th} paddingInlineStart="2" paddingInlineEnd="2">
              TBTC
            </LabelSm>
            <LabelSm as={Th} paddingInlineStart="2" paddingInlineEnd="2">
              TX
            </LabelSm>
            <LabelSm
              as={Th}
              textAlign="right"
              paddingInlineStart="2"
              paddingInlineEnd="2"
            >
              STATE
            </LabelSm>
          </Tr>
        </Thead>
        <BodySm as={Tbody}>
          {isHistoryEmpty ? (
            <EmptyHistoryTableBody />
          ) : (
            data.map((_) => (
              <Tr key={_.txHash}>
                <Td py={4} px={2}>
                  <InlineTokenBalance tokenAmount={_.amount} />
                </Td>
                <Td py={4} px={2}>
                  <ViewInBlockExplorer
                    id={_.txHash}
                    type={ExplorerDataType.TRANSACTION}
                    isTruncated
                    text={`${_.txHash.slice(0, 4)}...`}
                  />
                </Td>
                <Td py={4} px={2}>
                  <TbtcActionBadge status={_.status} />
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
    </>
  )
}

const EmptyRow = () => (
  <Tr>
    <Td py={4} px={2}>
      -.--
    </Td>
    <Td py={4} px={2} />
    <Td py={4} px={2} />
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
