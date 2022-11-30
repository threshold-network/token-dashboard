import { FC } from "react"
import { BaseModalProps } from "../../../types"
import withBaseModal from "../withBaseModal"
import InfoBox from "../../InfoBox"
import Link from "../../Link"

import {
  Alert,
  ModalCloseButton,
  ModalHeader,
  Button,
  BodyLg,
  BodyMd,
  H5,
  AlertIcon,
  ModalBody,
  ModalFooter,
} from "@threshold-network/components"

export enum FeedbackSubmissionType {
  AcceptAnalytics = "AcceptAnalytics",
  RejectAnalytics = "RejectAnalytics",
}

const feedbackSubmissionContent: Record<
  FeedbackSubmissionType,
  { header: string; alert: string; title: string; body: string | JSX.Element }
> = {
  [FeedbackSubmissionType.AcceptAnalytics]: {
    header: "Analytics",
    alert: "Analytics are turned on",
    title: "Thanks for opting in!",
    body: (
      <BodyLg>
        This will help us to make the product even better. You can change the
        analytics setting at any time in{" "}
        <Link to="/feedback/settings">Feedback Settings</Link>.
      </BodyLg>
    ),
  },
  [FeedbackSubmissionType.RejectAnalytics]: {
    header: "Analytics",
    alert: "Analytics are turned off",
    title: "You have opted out of analytics",
    body: (
      <BodyLg>
        If you change your mind, you can turn analytics on at any time in{" "}
        <Link to="/feedback/settings">Feedback Settings</Link>.
      </BodyLg>
    ),
  },
}

const FeedbackSubmissionModal: FC<
  BaseModalProps & { type: FeedbackSubmissionType }
> = ({ closeModal, type }) => {
  const { header, alert, title, body } = feedbackSubmissionContent[type]

  return (
    <>
      <ModalHeader>{header}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Alert status="success">
          <AlertIcon />
          <BodyMd>{alert}</BodyMd>
        </Alert>
        <InfoBox p={6}>
          <H5 mb={4}>{title}</H5>
          {typeof body === "string" ? <BodyLg>{body}</BodyLg> : body}
        </InfoBox>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal}>Dismiss</Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(FeedbackSubmissionModal)
