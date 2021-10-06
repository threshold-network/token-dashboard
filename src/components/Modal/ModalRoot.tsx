import { ElementType } from "react"
import ExampleModal from "./ExampleModal"
import SelectWalletModal from "./SelectWalletModal"
import { ModalType } from "../../enums"
import { useModal } from "../../hooks/useModal"

const MODAL_TYPES: Record<ModalType, ElementType> = {
  [ModalType.Example]: ExampleModal,
  [ModalType.SelectWallet]: SelectWalletModal,
}

const ModalRoot = () => {
  const { modalType, modalProps, closeModal } = useModal()

  if (!modalType) {
    return <></>
  }
  const SpecificModal = MODAL_TYPES[modalType]
  return <SpecificModal closeModal={closeModal} {...modalProps} />
}

export default ModalRoot
