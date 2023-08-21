import { FC } from "react"
import {
  BodySm,
  List,
  HStack,
  ListProps,
  LinkBox,
  LinkOverlay,
  Link,
  useColorModeValue,
} from "@threshold-network/components"
import shortenAddress from "../../utils/shortenAddress"
import Identicon from "../Identicon"
import { OutlineListItem } from "../OutlineListItem"
import { InlineTokenBalance } from "../TokenBalance"
import { getRelativeTime } from "../../utils/date"
import { RecentDeposit } from "../../hooks/tbtc/useFetchRecentDeposits"
import { createLinkToBlockExplorerForChain } from "../ViewInBlockExplorer"
import { ExplorerDataType } from "../../utils/createEtherscanLink"

export type RecentDepositsProps = {
  deposits: RecentDeposit[]
} & ListProps

export const RecentDeposits: FC<RecentDepositsProps> = ({
  deposits,
  ...restProps
}) => {
  return (
    <List spacing="1" position="relative" {...restProps}>
      {deposits.map(renderRecentDeposit)}
    </List>
  )
}

const RecentDepositItem: FC<RecentDeposit> = ({
  amount,
  address,
  date,
  txHash,
}) => {
  return (
    <LinkBox as={OutlineListItem}>
      <LinkOverlay
        // We can't use `ViewInBlockExplorer` or our custom `Link` component
        // because `LinkOverlay` component from chakra doesn't pass the
        // `isExternal` prop forward so `ViewInBlockExplorer` or `Link`
        // component sees this link as an internal so the link will open in the
        // same tab and the TS compiler throws an error that `to` prop is
        // missing because of conditional props of `Link` component.
        as={Link}
        textDecoration="none"
        _hover={{ textDecoration: "none" }}
        color="inherit"
        isExternal
        href={createLinkToBlockExplorerForChain.ethereum(
          txHash,
          ExplorerDataType.TRANSACTION
        )}
        flex="1"
      >
        <BodySm>
          <InlineTokenBalance
            tokenAmount={amount}
            withSymbol
            tokenSymbol="tBTC"
            color={useColorModeValue("brand.500", "brand.300")}
          />
        </BodySm>
      </LinkOverlay>
      <HStack spacing="2" flex="1">
        <Identicon address={address} />
        <BodySm textStyle="chain-identifier">{shortenAddress(address)}</BodySm>
      </HStack>
      <BodySm flex="1" textAlign="right">
        {getRelativeTime(date)}
      </BodySm>
    </LinkBox>
  )
}

const renderRecentDeposit = (item: RecentDeposit) => (
  <RecentDepositItem key={item.txHash} {...item} />
)
