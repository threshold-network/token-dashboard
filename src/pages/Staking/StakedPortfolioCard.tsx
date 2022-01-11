import { FC } from "react"
import { Button } from "@chakra-ui/react"
import Card from "../../components/Card"
import { Label3 } from "../../components/Typography"
import { useModal } from "../../hooks/useModal"
import { useWeb3React } from "@web3-react/core"
import { ModalType } from "../../enums"

const StakedPortfolioCard: FC = () => {
  const { openModal } = useModal()
  const { active, account } = useWeb3React()

  const openStakingModal = async () => {
    openModal(ModalType.StakingChecklist)
  }
  return (
    <Card>
      <Label3 mb={6} textDecoration="uppercase">
        Staked Portfolio
      </Label3>
      <Button disabled={!active || !account} onClick={openStakingModal}>
        STAKE
      </Button>
    </Card>
  )
}

export default StakedPortfolioCard
