import { ComponentProps, FC } from "react"
import { BodyMd, Box, BoxProps, H1, H5 } from "@threshold-network/components"
import { InlineTokenBalance } from "../TokenBalance"
import { formatFiatCurrencyAmount } from "../../utils/formatAmount"
import { RecentDeposits, RecentDepositsProps } from "./RecentDeposits"
import { ExternalHref } from "../../enums"
import { RecentDeposit } from "../../hooks/tbtc"
import Link from "../Link"

export type TvlProps = {
  tvl: string
  tvlInUSD: string
}

export const Tvl: FC<TvlProps> = ({ tvl, tvlInUSD }) => {
  return (
    <>
      <BodyMd mb="1.5">TVL</BodyMd>
      <H1 textAlign="center">
        <InlineTokenBalance tokenAmount={tvl} /> <H5 as="span">tBTC</H5>
      </H1>
      <BodyMd textAlign="center">
        {formatFiatCurrencyAmount(tvlInUSD, "0,00.00")} USD
      </BodyMd>
    </>
  )
}

export type ProtocolHistoryProps = {
  deposits: RecentDeposit[]
}

export const ProtocolHistoryTitle: FC<ComponentProps<typeof BodyMd>> = (
  props
) => (
  <BodyMd mb="3" {...props}>
    Protocol History
  </BodyMd>
)

export const ProtocolHistoryViewMoreLink: FC<BoxProps> = (props) => (
  <Box as="p" mt="3.5" textAlign="center" {...props}>
    <Link isExternal href={ExternalHref.tBTCDuneDashboard}>
      View on Dune Analytics
    </Link>
  </Box>
)

export const ProtocolHistoryRecentDeposits: FC<RecentDepositsProps> = ({
  deposits,
  ...restProps
}) => <RecentDeposits deposits={deposits} {...restProps} />

export const ProtocolHistory: FC<ProtocolHistoryProps> = ({ deposits }) => {
  return (
    <>
      <ProtocolHistoryTitle />
      <ProtocolHistoryRecentDeposits deposits={deposits} />
      <ProtocolHistoryViewMoreLink />
    </>
  )
}
