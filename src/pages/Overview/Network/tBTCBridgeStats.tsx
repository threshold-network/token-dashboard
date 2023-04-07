import { FC } from "react"
import { Card, Divider, LabelSm } from "@threshold-network/components"
import {
  DefaultProtocolHistory,
  ProtocolHistoryProps,
  TBTCText,
  TVL,
  TVLProps,
} from "../../../components/tBTC"

type TBTCBrdigeStatsProps = ProtocolHistoryProps & TVLProps

export const TBTCBrdigeStats: FC<TBTCBrdigeStatsProps> = ({
  tvl,
  tvlInUSD,
  deposits,
}) => {
  return (
    <Card>
      <LabelSm mb="4">
        <TBTCText /> Bridge Stats
      </LabelSm>
      <TVL tvl={tvl} tvlInUSD={tvlInUSD} />
      <Divider my="6" />
      <DefaultProtocolHistory deposits={deposits} />
    </Card>
  )
}
