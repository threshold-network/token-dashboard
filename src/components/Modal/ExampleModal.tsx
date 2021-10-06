import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react"
import { FC } from "react"
import withBaseModal from "./withBaseModal"

const ExampleModal: FC<{ name: string; closeModal: () => void }> = ({
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
