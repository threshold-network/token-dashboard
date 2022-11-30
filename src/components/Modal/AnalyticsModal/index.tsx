import { FC } from "react"
import {
  BodyLg,
  BodySm,
  BodyXs,
  Button,
  H5,
  Image,
  ModalBody,
  ModalFooter,
  useColorModeValue,
  VStack,
  ModalCloseButton,
  ModalHeader,
} from "@threshold-network/components"
import { BaseModalProps } from "../../../types"
import withBaseModal from "../withBaseModal"
import { useAppDispatch } from "../../../hooks/store"
import { useModal } from "../../../hooks/useModal"
import { analyticsSlice } from "../../../store/analytics"
import { ExternalHref, ModalType } from "../../../enums"
import { FeedbackSubmissionType } from "../FeedbackSubmissionModal"
import FeedbackAnalyticsInfo from "../../FeedbackAnalyticsInfo"
import Link from "../../Link"
import analyticsImageLight from "../../../static/images/AnalyticsIllustration.png"
import analyticsImageDark from "../../../static/images/AnalyticsIllustrationDark.png"

const AnalyticsModal: FC<BaseModalProps> = () => {
  const dispatch = useAppDispatch()
  const { openModal } = useModal()

  const handleAccept = () => {
    dispatch(analyticsSlice.actions.optIn())
    openModal(ModalType.FeedbackSubmission, {
      type: FeedbackSubmissionType.AcceptAnalytics,
    })
  }
  const handleDecline = () => {
    dispatch(analyticsSlice.actions.optOut())
    openModal(ModalType.FeedbackSubmission, {
      type: FeedbackSubmissionType.RejectAnalytics,
    })
  }

  const headerImgSrc = useColorModeValue(
    analyticsImageLight,
    analyticsImageDark
  )

  const subduedTextColor = useColorModeValue("gray.500", "gray.400")

  return (
    <>
      <ModalHeader>Analytics</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Image mx="auto" mb={8} maxW="104px" src={headerImgSrc} />
        <H5 mb={2}>
          Will you provide anonymous data to help improve the product?
        </H5>
        <BodyLg mb={10} color={subduedTextColor}>
          Change this at any time in Feedback Settings.
        </BodyLg>
        <FeedbackAnalyticsInfo />
        <VStack mb={4}>
          <BodySm color={subduedTextColor}>
            All our analytics reports are publicly available{" "}
            <Link isExternal href={ExternalHref.analyticsReports}>
              here
            </Link>
          </BodySm>
          <BodyXs color={subduedTextColor}>
            By clicking Accept, you consent to allow a cookie to record this
            setting.
          </BodyXs>
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Button onClick={handleDecline} variant="outline" mr={2}>
          Decline
        </Button>
        <Button onClick={handleAccept}>Accept</Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(AnalyticsModal)
