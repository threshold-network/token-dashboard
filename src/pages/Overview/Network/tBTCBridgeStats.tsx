import { FC } from "react"
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
import { formatFiatCurrencyAmount } from "../../../utils/formatAmount"
import { RecentDeposit } from "../../../hooks/tbtc"

type TBTCBrdigeStatsProps = {
  tvl: string
  tvlInUSD: string
  deposits: RecentDeposit[]
}

export const TBTCBrdigeStats: FC<TBTCBrdigeStatsProps> = ({
  tvl,
  tvlInUSD,
  deposits,
}) => {
  return (
    <Card>
      <LabelSm mb="4">tBTC Bridge Stats</LabelSm>
      <BodyMd mb="1.5">TVL</BodyMd>
      {/* TODO: Fetch tvl from contracts.*/}
      <H1 textAlign="center">
        <InlineTokenBalance tokenAmount={tvl} /> <H5 as="span">tBTC</H5>
      </H1>
      <BodyMd textAlign="center">
        {formatFiatCurrencyAmount(tvlInUSD, "0,00.00")} USD
      </BodyMd>

      <Divider my="6" />
      <BodyMd mb="3">Protocol History</BodyMd>
      <RecentDeposits deposits={deposits} />
      <Box as="p" mt="3.5" textAlign="center">
        <Link isExternal href={ExternalHref.tBTCDuneDashboard}>
          View on Dune Analytics
        </Link>
      </Box>
    </Card>
  )
}
