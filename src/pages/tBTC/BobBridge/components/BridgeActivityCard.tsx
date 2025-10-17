import { FC } from "react"
import { ComponentProps } from "react"
import {
  Card,
  LabelSm,
  List,
  Box,
  Skeleton,
  Stack,
} from "@threshold-network/components"
import { ActivityItemWrapper } from "../../../../components/tBTC"
import { InlineTokenBalance } from "../../../../components/TokenBalance"
import { BridgeActivity } from "../../../../threshold-ts/bridge"

const BridgeTypeBadge: FC<{ bridgeRoute: string }> = ({ bridgeRoute }) => {
  const label = bridgeRoute === "ccip" ? "CCIP" : "STANDARD BOB"
  return (
    <Box
      as="span"
      px="2"
      py="1"
      borderRadius="md"
      fontSize="xs"
      fontWeight="medium"
      bg="green.50"
      color="green.700"
      display="inline-flex"
      alignItems="center"
    >
      {label}
    </Box>
  )
}

const BridgeActivityItem: FC<{
  amount: string
  explorerUrl: string
  bridgeRoute: string
}> = ({ amount, explorerUrl, bridgeRoute }) => {
  return (
    <ActivityItemWrapper>
      <Box
        as="a"
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        textDecoration="none"
        _hover={{ textDecoration: "none" }}
        color="inherit"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        w="100%"
      >
        <InlineTokenBalance tokenAmount={amount} />
        <BridgeTypeBadge bridgeRoute={bridgeRoute} />
      </Box>
    </ActivityItemWrapper>
  )
}

const BridgeActivityHeader = () => {
  return (
    <Box display="flex" justifyContent="space-between" mt="10">
      <LabelSm color="gray.500">tBTC</LabelSm>
      <LabelSm color="gray.500">bridge</LabelSm>
    </Box>
  )
}

const BridgeActivityLoadingState = () => {
  return (
    <Stack mt="1rem">
      <Skeleton height="20px" />
      <Skeleton height="20px" />
      <Skeleton height="20px" />
    </Stack>
  )
}

interface BridgeActivityCardProps extends ComponentProps<typeof Card> {
  data: BridgeActivity[]
  isFetching: boolean
}

export const BridgeActivityCard: FC<BridgeActivityCardProps> = (props) => {
  const { data, isFetching, ...cardProps } = props
  const isBridgeHistoryEmpty = data.length === 0

  return (
    <Card {...cardProps} minH="530px">
      <LabelSm mb="5">bridge activity</LabelSm>
      <BridgeActivityHeader />
      {isFetching ? (
        <BridgeActivityLoadingState />
      ) : (
        <List spacing="1" mt="2" mx="-0.75rem">
          {isBridgeHistoryEmpty ? (
            <>
              <ActivityItemWrapper>
                <Box as="span" color="gray.700">
                  -.--
                </Box>
                <Box as="span" color="gray.700">
                  -.--
                </Box>
              </ActivityItemWrapper>
              <ActivityItemWrapper>
                <Box as="span" color="gray.700">
                  -.--
                </Box>
                <Box as="span" color="gray.700">
                  -.--
                </Box>
              </ActivityItemWrapper>
            </>
          ) : (
            data.map((item) => (
              <BridgeActivityItem
                key={`${item.activityKey}-${item.txHash}`}
                amount={item.amount}
                explorerUrl={item.explorerUrl}
                bridgeRoute={item.bridgeRoute}
              />
            ))
          )}
        </List>
      )}
    </Card>
  )
}
