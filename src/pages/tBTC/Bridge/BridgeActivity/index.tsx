import { ComponentProps, FC } from "react"
import {
  Badge,
  BodyMd,
  Card,
  HStack,
  Image,
  LabelSm,
  List,
  ListItem,
  useColorModeValue,
  Box,
  LinkBox,
  LinkOverlay,
} from "@threshold-network/components"
import {
  BridgeActivityStatus,
  BridgeActivity as BridgeActivityType,
} from "../../../../threshold-ts/tbtc"
import emptyHistoryImageSrcDark from "../../../../static/images/tBTC-bridge-no-history-dark.svg"
import emptyHistoryImageSrcLight from "../../../../static/images/tBTC-bridge-no-history-light.svg"
import { InlineTokenBalance } from "../../../../components/TokenBalance"
import Link from "../../../../components/Link"

const bridgeActivityStatusToBadgeProps: Record<
  BridgeActivityStatus,
  { colorScheme: string }
> = {
  [BridgeActivityStatus.MINTED]: {
    colorScheme: "green",
  },
  [BridgeActivityStatus.PENDING]: {
    colorScheme: "yellow",
  },
  [BridgeActivityStatus.ERROR]: {
    colorScheme: "red",
  },
}

const TBTCStatusBadge: FC<{ status: BridgeActivityStatus }> = ({ status }) => {
  return (
    <Badge
      variant="subtle"
      {...bridgeActivityStatusToBadgeProps[status]}
      size="sm"
      display="flex"
      alignItems="center"
    >
      {status}
    </Badge>
  )
}

export const BridgeActivityCard: FC<ComponentProps<typeof Card>> = ({
  children,
  ...props
}) => {
  return (
    <Card {...props} minH="530px">
      <LabelSm mb="5">my activity</LabelSm>
      {children}
    </Card>
  )
}

const ActivityItemWrapper: FC = ({ children }) => (
  <LinkBox
    as={ListItem}
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    borderColor="gray.100"
    borderWidth="1px"
    borderStyle="solid"
    borderRadius="6px"
    py="4"
    pl="6"
    pr="3"
    mx="-0.75rem"
  >
    {children}
  </LinkBox>
)

const ActivityItem: FC<BridgeActivityType> = ({
  amount,
  status,
  depositKey,
}) => {
  return (
    <ActivityItemWrapper>
      <LinkOverlay
        as={Link}
        textDecoration="none"
        _hover={{ textDecoration: "none" }}
        color="inherit"
        to={`/tBTC/mint/deposit/${depositKey}`}
      >
        <InlineTokenBalance tokenAmount={amount} />
      </LinkOverlay>
      <TBTCStatusBadge status={status} />
    </ActivityItemWrapper>
  )
}

const renderActivityItem = (item: BridgeActivityType) => (
  <ActivityItem key={item.depositKey} {...item} />
)

export const BridgeActivity: FC<{
  data: BridgeActivityType[]
}> = ({ data }) => {
  const epmtyHistoryImg = useColorModeValue(
    emptyHistoryImageSrcLight,
    emptyHistoryImageSrcDark
  )

  const isHistoryEmpty = data.length === 0

  return (
    <>
      <HStack justifyContent="space-between" mt="10">
        <LabelSm color="gray.500">tBTC</LabelSm>
        <LabelSm color="gray.500">state</LabelSm>
      </HStack>
      <List spacing="1" mt="2">
        {isHistoryEmpty ? <EmptyActivity /> : data.map(renderActivityItem)}
      </List>
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

const EmptyActivity: FC = () => {
  return (
    <>
      <ActivityItemWrapper>
        <Box as="span">-.--</Box>
        <Box as="span">-.--</Box>
      </ActivityItemWrapper>
      <ActivityItemWrapper>
        <Box as="span">-.--</Box>
        <Box as="span">-.--</Box>
      </ActivityItemWrapper>
    </>
  )
}
