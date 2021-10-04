import { ModalType, useModal } from "../../store/modal"
import ExampleModal from "./ExampleModal"
import SelectWalletModal from "./SelectWalletModal"

const ModalRoot = () => {
  const { modalType } = useModal()

  switch (modalType) {
    case ModalType.example: {
      return <ExampleModal />
    }
    case ModalType.selectWallet: {
      return <SelectWalletModal />
    }
    // additional modals would be registered here
    default:
      return null
  }
}

export default ModalRoot
