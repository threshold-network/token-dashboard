import { ComponentType } from "react"
import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react"
import { BaseModalProps } from "../../types"

function withBaseModal<T extends BaseModalProps>(
  WrappedModalContent: ComponentType<T>
) {
  return (props: T) => {
    return (
      <Modal isOpen onClose={props.closeModal}>
        <ModalOverlay />
        <ModalContent>
          <WrappedModalContent {...props} />
        </ModalContent>
      </Modal>
    )
  }
}

export default withBaseModal
