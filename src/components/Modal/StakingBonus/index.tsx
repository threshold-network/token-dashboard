import { FC } from "react"
import { useWeb3React } from "@web3-react/core"
import { ConnectWallet } from "./ConnectWallet"
import withBaseModal from "../withBaseModal"
import { BaseModalProps } from "../../../types"
import { EligibilityConfirmation } from "./EligibilityConfirmation"
import { useStakingState } from "../../../hooks/useStakingState"

const StakingBonusModal: FC<BaseModalProps> = ({ closeModal }) => {
  const { active } = useWeb3React()
  const { stakes } = useStakingState()

  return (
    <>
      {!active && <ConnectWallet closeModal={closeModal} />}
      {active && (
        <EligibilityConfirmation closeModal={closeModal} stakes={stakes} />
      )}
    </>
  )
}

export default withBaseModal(StakingBonusModal)
