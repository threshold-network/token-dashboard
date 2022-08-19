import { FC } from "react"
import InitiateDeauthorization from "./InititateDeauthorization"
import withBaseModal from "../withBaseModal"
import { BaseModalProps, StakeData } from "../../../types"

export interface DeauthorizeApplicationModalProps {
  stake: StakeData
}

const DeauthorizeApplicationModal: FC<
  BaseModalProps & DeauthorizeApplicationModalProps
> = ({ closeModal }) => {
  return <InitiateDeauthorization closeModal={closeModal} />
}

export default withBaseModal(DeauthorizeApplicationModal)
