import { FC } from "react"
import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Stack,
} from "@threshold-network/components"
import { BaseModalProps } from "../../../types"
import withBaseModal from "../withBaseModal"

const AnalyticsModalBase: FC<BaseModalProps> = ({ closeModal }) => {
  return (
    <>
      <ModalHeader>Claiming Rewards</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack spacing={6}>HEre is the content</Stack>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button>Confirm</Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(AnalyticsModalBase)
