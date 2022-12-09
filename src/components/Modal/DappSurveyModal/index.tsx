import { FC } from "react"
import {
  Button,
  Divider,
  H5,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "@threshold-network/components"
import { BaseModalProps } from "../../../types"
import withBaseModal from "../withBaseModal"
import InfoBox from "../../InfoBox"
import { PosthogEvent } from "../../../types/posthog"

interface SurveyQuestion {
  text: string
  value: string
}

interface DappSurveyModalProps extends BaseModalProps {
  title: string
  captureEvent: PosthogEvent
  surveyQuestions: SurveyQuestion[]
}

const DappSurveyModal: FC<DappSurveyModalProps> = ({
  closeModal,
  title,
  captureEvent,
  surveyQuestions,
}) => {
  const handleSubmit = () => {
    console.log("post hog capture ", captureEvent)
  }

  return (
    <>
      <ModalHeader>dApp Survey</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox>
          <H5 mb={2}>{title}</H5>
        </InfoBox>
        <Divider />
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Dismiss
        </Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(DappSurveyModal)
