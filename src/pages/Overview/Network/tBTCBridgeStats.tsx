import {
  BodyMd,
  Box,
  Card,
  Divider,
  H1,
  H5,
  LabelSm,
} from "@threshold-network/components"
import { InlineTokenBalance } from "../../../components/TokenBalance"
import Link from "../../../components/Link"
import { ExternalHref } from "../../../enums"
import { RecentDeposits } from "../../../components/tBTC/RecentDeposits"

// TODO: fetch recent deposit from the subgraph.
const mockDeposits = [
  {
    amount: "100000000000000000",
    address: "0xbaf6dc2e647aeb6f510f9e318856a1bcd66c5e19",
    date: 1680776443,
    txHash: "1",
  },
  {
    amount: "155000000000000000",
    address: "0xd0111cf5bf230832f422da1c6c1d0a512d4e005a",
    date: 1680772306,
    txHash: "2",
  },
  {
    amount: "2000000000000000000",
    address: "0x60d0f24d97222726dd8355368cc4584500f31ae8",
    date: 1680769504,
    txHash: "3",
  },
  {
    amount: "24000000000000000000",
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    date: 1680772306,
    txHash: "4",
  },
]

export const TBTCBrdigeStats = () => {
  return (
    <Card>
      <LabelSm mb="4">tBTC Bridge Stats</LabelSm>
      <BodyMd mb="1.5">TVL</BodyMd>
      {/* TODO: Fetch tvl from contracts.*/}
      <H1 textAlign="center">
        <InlineTokenBalance tokenAmount="429560000000000000000" />{" "}
        <H5 as="span">tBTC</H5>
      </H1>
      <BodyMd textAlign="center">$8,000,234.00 USD</BodyMd>

      <Divider my="6" />
      <BodyMd mb="3">Protocol History</BodyMd>
      <RecentDeposits deposits={mockDeposits} />
      <Box as="p" mt="3.5" textAlign="center">
        <Link isExternal href={ExternalHref.tBTCDuneDashboard}>
          View on Dune Analytics
        </Link>
      </Box>
    </Card>
  )
}
