import { FC } from "react"
import StakingChecklist from "../../components/StakingChecklist"
import { LabelSm, Card } from "@threshold-network/components"

const StakingChecklistCard: FC = () => {
  return (
    <Card>
      <LabelSm mb={6}>Checklist before staking</LabelSm>
      <StakingChecklist />
    </Card>
  )
}

export default StakingChecklistCard
