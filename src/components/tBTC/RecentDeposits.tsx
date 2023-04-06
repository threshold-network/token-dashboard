import { FC } from "react"
import { BodySm, List, HStack, ListProps } from "@threshold-network/components"
import shortenAddress from "../../utils/shortenAddress"
import Identicon from "../Identicon"
import { OutlineListItem } from "../OutlineListItem"
import { InlineTokenBalance } from "../TokenBalance"
import { getRelativeTime } from "../../utils/date"
import { RecentDeposit } from "../../hooks/tbtc/useFetchRecentDeposits"

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

const RecentDepositItem: FC<RecentDeposit> = ({ amount, address, date }) => {
  return (
    <OutlineListItem>
      <BodySm>
        <InlineTokenBalance
          tokenAmount={amount}
          withSymbol
          tokenSymbol="tBTC"
          color="brand.500"
        />
      </BodySm>
      <HStack spacing="2">
        <Identicon address={address} />
        <BodySm textStyle="chain-identifier">{shortenAddress(address)}</BodySm>
      </HStack>
      <BodySm>{getRelativeTime(date)}</BodySm>
    </OutlineListItem>
  )
}

const renderRecentDeposit = (item: RecentDeposit) => (
  <RecentDepositItem key={item.txHash} {...item} />
)
