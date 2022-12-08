import { FC } from "react"
import { BaseModalProps } from "../../../types"
import withBaseModal from "../withBaseModal"
import InfoBox from "../../InfoBox"
import Link from "../../Link"
import {
  Alert,
  AlertIcon,
  BodyLg,
  BodyMd,
  Button,
  H5,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "@threshold-network/components"
import { ExternalHref } from "../../../enums"

export enum FeedbackSubmissionType {
  AcceptAnalytics = "AcceptAnalytics",
  RejectAnalytics = "RejectAnalytics",
  BugReport = "BugReport",
  Suggestion = "Suggestion",
  Usability = "Usability",
}

const feedbackSubmissionContent: Record<
  FeedbackSubmissionType,
  { header: string; alert: string; title: string; body: string | JSX.Element }
> = {
  [FeedbackSubmissionType.AcceptAnalytics]: {
    header: "Analytics",
    alert: "Analytics are turned on.",
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
    alert: "Analytics are turned off.",
    title: "You have opted out of analytics.",
    body: (
      <BodyLg>
        If you change your mind, you can turn analytics on at any time in{" "}
        <Link to="/feedback/settings">Feedback Settings</Link>.
      </BodyLg>
    ),
  },
  [FeedbackSubmissionType.BugReport]: {
    header: "Success",
    alert: "Response Submitted.",
    title: "Thank you for your bug report.",
    body: (
      <BodyLg>
        You can ask other Threshold users and DAO members questions by joining
        the{" "}
        <Link isExternal href={ExternalHref.thresholdDiscord}>
          Discord
        </Link>
      </BodyLg>
    ),
  },
  [FeedbackSubmissionType.Suggestion]: {
    header: "Success",
    alert: "Response Submitted.",
    title: "Thank you for your suggestion.",
    body: (
      <BodyLg>
        You can discuss your idea with other Threshold users and the DAO by
        joining the
        <Link isExternal href={ExternalHref.thresholdDiscord}>
          Discord
        </Link>
      </BodyLg>
    ),
  },
  [FeedbackSubmissionType.Usability]: {
    header: "Success",
    alert: "Response Submitted.",
    title: "Thank you for your feedback.",
    body: "This information will help us to improve the user experience of our products.",
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
