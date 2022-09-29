import { FC, ComponentProps } from "react"
import {
  BodyMd,
  LabelSm,
  Card,
  FlowStepStatus,
} from "@threshold-network/components"
import StakingChecklist from "../../../../components/StakingTimeline"

export const NewTStakesCard: FC<ComponentProps<typeof Card>> = (props) => {
  return (
    <Card {...props}>
      <LabelSm>new threshold stakes</LabelSm>
      <BodyMd mt="5" mb="5">
        Before you start staking on Threshold Network, make sure you are aware
        of the following requirements:
      </BodyMd>
      <StakingChecklist
        statuses={[
          FlowStepStatus.active,
          FlowStepStatus.active,
          FlowStepStatus.active,
        ]}
      />
    </Card>
  )
}
