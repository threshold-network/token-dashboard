import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react"
import { FC } from "react"
import withBaseModal from "./withBaseModal"
import BaseModalProps from "../../types"

const ExampleModal: FC<{ name: string } & BaseModalProps> = ({
  name,
  closeModal,
}) => {
  return (
    <>
      <ModalHeader>Modal Title</ModalHeader>
      <ModalCloseButton />
      <ModalBody>Hello {name}!</ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" mr={3} onClick={closeModal}>
          Close
        </Button>
        <Button variant="ghost">Secondary Action</Button>
      </ModalFooter>
    </>
  )
}
export default withBaseModal(ExampleModal)
