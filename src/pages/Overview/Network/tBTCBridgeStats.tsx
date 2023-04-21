import { FC } from "react"
import { Card, Divider, LabelSm } from "@threshold-network/components"
import {
  ProtocolHistory,
  ProtocolHistoryProps,
  TBTCText,
  TVL,
  TVLProps,
} from "../../../components/tBTC"

type TBTCBridgeStatsProps = ProtocolHistoryProps & TVLProps

export const TBTCBridgeStats: FC<TBTCBridgeStatsProps> = ({
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
      <ProtocolHistory deposits={deposits} />
    </Card>
  )
}
