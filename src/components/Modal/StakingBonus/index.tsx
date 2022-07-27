import { FC } from "react"
import { useWeb3React } from "@web3-react/core"
import { useSelector } from "react-redux"
import { ConnectWallet } from "./ConnectWallet"
import withBaseModal from "../withBaseModal"
import { BaseModalProps } from "../../../types"
import { EligibilityConfirmation } from "./EligibilityConfirmation"
import { RootState } from "../../../store"

const StakingBonusModal: FC<BaseModalProps> = ({ closeModal }) => {
  const { active } = useWeb3React()
  const rewards = useSelector(
    (state: RootState) => state.rewards.stakingBonus.rewards
  )

  return (
    <>
      {!active && <ConnectWallet closeModal={closeModal} />}
      {active && (
        <EligibilityConfirmation closeModal={closeModal} rewards={rewards} />
      )}
    </>
  )
}

export default withBaseModal(StakingBonusModal)
