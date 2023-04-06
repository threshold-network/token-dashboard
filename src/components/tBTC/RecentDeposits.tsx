import { FC } from "react"
import { BodySm, List, HStack } from "@threshold-network/components"
import shortenAddress from "../../utils/shortenAddress"
import Identicon from "../Identicon"
import { OutlineListItem } from "../OutlineListItem"
import { InlineTokenBalance } from "../TokenBalance"

type RecentDeposit = {
  amount: string
  address: string
  date: string
  txHash: string
}

type RecentDepositsProps = {
  deposits: RecentDeposit[]
}

export const RecentDeposits: FC<RecentDepositsProps> = ({ deposits }) => {
  return <List spacing="1">{deposits.map(renderRecentDeposit)}</List>
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
      {/* TODO: format date */}
      <BodySm>{date}</BodySm>
    </OutlineListItem>
  )
}

const renderRecentDeposit = (item: RecentDeposit) => (
  <RecentDepositItem key={item.txHash} {...item} />
)
