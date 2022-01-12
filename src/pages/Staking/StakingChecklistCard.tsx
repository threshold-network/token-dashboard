import { FC } from "react"
import Card from "../../components/Card"
import StakingChecklist from "../../components/StakingChecklist"
import { Label3 } from "../../components/Typography"

const StakingChecklistCard: FC = () => {
  return (
    <Card>
      <Label3 mb={6} textDecoration="uppercase">
        Checklist before staking
      </Label3>
      <StakingChecklist />
    </Card>
  )
}

export default StakingChecklistCard
