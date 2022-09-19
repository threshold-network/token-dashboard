import { FC, ComponentProps } from "react"
import { BodyMd, BoxLabel, LabelSm, Card } from "@threshold-network/components"
import StakingChecklist from "../../../../components/StakingTimeline"

export const NewTStakesCard: FC<ComponentProps<typeof Card>> = (props) => {
  return (
    <Card {...props}>
      <LabelSm>new T stakes</LabelSm>
      <BodyMd mt="5" mb="5">
        Before you start staking on Threshold Network, make sure you are aware
        of the following requirements:
      </BodyMd>
      <BoxLabel status="secondary" mb={6}>
        Staking Timeline
      </BoxLabel>
      <StakingChecklist />
    </Card>
  )
}
