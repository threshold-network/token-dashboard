import { FC } from "react"
import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react"
import InfoBox from "../../InfoBox"
import { BodyLg, H5 } from "@threshold-network/components"
import { BaseModalProps } from "../../../types"
import withBaseModal from "../withBaseModal"

const NewAppsToAuthorizeModal: FC<BaseModalProps> = ({ closeModal }) => {
  return (
    <>
      <ModalHeader>New Apps Available</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal">
          <H5>
            There are new apps available for you to authorize and earn rewards!
          </H5>
          <BodyLg mt="4">
            This will allow an app to use a portion of your stake. You can
            authorize 100% of your stake to all apps and change this amount at
            any time.
          </BodyLg>
        </InfoBox>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Dismiss
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(NewAppsToAuthorizeModal)
