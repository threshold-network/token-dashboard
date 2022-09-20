import { FC } from "react"
import InitiateDeauthorization from "./InititateDeauthorization"
import withBaseModal from "../withBaseModal"
import { BaseModalProps, StakeData } from "../../../types"
import { useStakingState } from "../../../hooks/useStakingState"

export interface DeauthorizeApplicationModalProps {
  stake: StakeData
}

const DeauthorizeApplicationModal: FC<
  BaseModalProps & DeauthorizeApplicationModalProps
> = ({ closeModal }) => {
  // TODO: Data for this component is mocked. Replace with real data when available.
  const { stakes } = useStakingState()

  return <InitiateDeauthorization stake={stakes[0]} closeModal={closeModal} />
}

export default withBaseModal(DeauthorizeApplicationModal)
