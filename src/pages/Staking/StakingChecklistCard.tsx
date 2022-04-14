import { FC } from "react"
import StakingChecklist from "../../components/StakingChecklist"
import { Label3, Card } from "@threshold-network/components"

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
