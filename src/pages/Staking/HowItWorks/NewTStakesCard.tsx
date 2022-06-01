import { FC, ComponentProps } from "react"
import Card from "../../../components/Card"
import { Body2, Label3 } from "../../../components/Typography"
import StakingChecklist from "../../../components/StakingChecklist"

export const NewTStakesCard: FC<ComponentProps<typeof Card>> = (props) => {
  return (
    <Card {...props}>
      <Label3>new threshold stakes</Label3>
      <Body2 mt="5" mb="5">
        Before you start staking on Threshold Network, make sure you are aware
        of the following requirements:
      </Body2>
      <StakingChecklist />
    </Card>
  )
}
