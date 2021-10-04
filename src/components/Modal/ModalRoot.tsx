import { ModalType, useModal } from "../../store/modal"
import ExampleModal from "./ExampleModal"

const ModalRoot = () => {
  const { modalType } = useModal()

  switch (modalType) {
    case ModalType.example: {
      return <ExampleModal />
    }
    // additional modals would be registered here
    default:
      return null
  }
}

export default ModalRoot
