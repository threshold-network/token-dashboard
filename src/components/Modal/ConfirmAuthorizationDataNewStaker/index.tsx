import { FC } from "react"
import {
  ModalBody,
  ModalCloseButton,
  ModalHeader,
} from "@threshold-network/components"
import { BaseModalProps } from "../../../types"
import { StakeData } from "../../../types/staking"
import withBaseModal from "../withBaseModal"

const ConfirmAuthorizationDataNewStaker: FC<
  BaseModalProps & { stake: StakeData }
> = () => {
  return (
    <>
      <ModalHeader>Authorize Apps</ModalHeader>
      <ModalCloseButton />
      <ModalBody>somthig</ModalBody>
    </>
  )
}

export default withBaseModal(ConfirmAuthorizationDataNewStaker)
