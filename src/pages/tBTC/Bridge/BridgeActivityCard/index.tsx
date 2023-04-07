import { ComponentProps, FC } from "react"
import { Card, LabelSm } from "@threshold-network/components"
import {
  BridgeAcivityHeader,
  BridgeActivity,
  BridgeActivityData,
  BridgeActivityEmptyHistoryImg,
  BridgeActivityProps,
} from "../../../../components/tBTC"

export const BridgeActivityCard: FC<
  ComponentProps<typeof Card> & BridgeActivityProps
> = ({ isFetching, data, children, ...props }) => {
  return (
    <Card {...props} minH="530px">
      <LabelSm mb="5">my activity</LabelSm>
      <BridgeActivity data={data} isFetching={isFetching}>
        <BridgeAcivityHeader />
        <BridgeActivityData />
        <BridgeActivityEmptyHistoryImg />
      </BridgeActivity>
    </Card>
  )
}
