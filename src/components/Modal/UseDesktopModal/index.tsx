import { FC } from "react"
import { H5 } from "@threshold-network/components"
import withBaseModal from "../withBaseModal"
import { Alert, AlertIcon, ModalBody, ModalHeader } from "@chakra-ui/react"

const UseDesktopModal: FC = () => {
  return (
    <>
      <ModalHeader>
        <H5>Use a desktop computer</H5>
      </ModalHeader>
      <ModalBody>
        <Alert status="success" mb={4}>
          <AlertIcon />
          This page does not work for mobile devices.
        </Alert>
      </ModalBody>
    </>
  )
}

export default withBaseModal(UseDesktopModal)
