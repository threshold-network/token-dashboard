import { useModal } from "../../hooks/useModal"
import { MODAL_TYPES } from "../../types"

const ModalRoot = () => {
  const { modalType, modalProps, closeModal } = useModal()

  console.log("why are you dumb ", modalProps)

  if (!modalType) {
    return <></>
  }
  const SpecificModal = MODAL_TYPES[modalType]
  return <SpecificModal closeModal={closeModal} {...modalProps} />
}

export default ModalRoot
