import { FC } from "react"
import Card from "../../components/Card"
import { Label3 } from "../../components/Typography"
import { useModal } from "../../hooks/useModal"
import { ModalType } from "../../enums"
import SubmitTxButton from "../../components/SubmitTxButton"

const StakedPortfolioCard: FC = () => {
  const { openModal } = useModal()

  const openStakingModal = async () => {
    openModal(ModalType.StakingChecklist)
  }
  return (
    <Card>
      <Label3 mb={6} textDecoration="uppercase">
        Staked Portfolio
      </Label3>
      <SubmitTxButton onSubmit={openStakingModal} submitText="STAKE" />
    </Card>
  )
}

export default StakedPortfolioCard
