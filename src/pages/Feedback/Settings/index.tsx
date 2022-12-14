import React from "react"
import { PageComponent } from "../../../types"
import {
  BodyMd,
  Box,
  Card,
  Divider,
  H5,
  LabelLg,
  Stack,
  Switch,
  useColorModeValue,
} from "@threshold-network/components"
import FeedbackAnalyticsInfo from "../../../components/FeedbackAnalyticsInfo"
import Link from "../../../components/Link"
import { useAnalytics } from "../../../hooks/useAnalytics"
import { useModal } from "../../../hooks/useModal"
import { ModalType } from "../../../enums"
import { FeedbackSubmissionType } from "../../../components/Modal/FeedbackSubmissionModal"

const Settings: PageComponent = () => {
  const { isAnalyticsEnabled, enableAnalytics, disableAnalytics } =
    useAnalytics()

  const { openModal } = useModal()

  const toggleAnalytics = () => {
    if (isAnalyticsEnabled) {
      disableAnalytics()
      openModal(ModalType.FeedbackSubmission, {
        type: FeedbackSubmissionType.RejectAnalytics,
      })
    } else {
      enableAnalytics()
      openModal(ModalType.FeedbackSubmission, {
        type: FeedbackSubmissionType.AcceptAnalytics,
      })
    }
  }

  return (
    <Card>
      <Box display="flex" justifyContent="space-between">
        <H5 mb={8}>Analytics</H5>
        <Box display="flex">
          <LabelLg
            color={
              isAnalyticsEnabled
                ? useColorModeValue("brand.500", "brand.400")
                : "gray.500"
            }
            mr={2}
          >
            {isAnalyticsEnabled ? "ON" : "OFF"}
          </LabelLg>
          <Switch
            size="lg"
            isChecked={isAnalyticsEnabled || false}
            colorScheme="brand"
            onChange={toggleAnalytics}
          />
        </Box>
      </Box>
      <Divider mb={4} />
      <Stack
        justifyContent="space-between"
        direction={{ base: "column", xl: "row" }}
      >
        <FeedbackAnalyticsInfo
          m={{ base: "auto", xl: 0 }}
          mb={{ base: 12, xl: 0 }}
        />
        <Box w={{ base: "full", xl: "50%" }}>
          <BodyMd mb={6}>
            In order to improve our user experience, Threshold is using an
            opt-in version of{" "}
            <Link isExternal href="https://posthog.com/">
              Posthog
            </Link>
            , an open source data analytics platform. Posthog data will allow us
            to make an even better user experience.
          </BodyMd>
          <BodyMd>
            Your privacy is paramount. We do not collect any personally
            identifiable information, and we only collect when you opt-in to
            data analytics.
          </BodyMd>
        </Box>
      </Stack>
    </Card>
  )
}

Settings.route = {
  path: "settings",
  title: "Settings",
  index: false,
  isPageEnabled: true,
}

export default Settings
