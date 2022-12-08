import React from "react"
import { PageComponent } from "../../../types"
import {
  Card,
  Divider,
  H5,
  BodyMd,
  Box,
  LabelLg,
} from "@threshold-network/components"
import FeedbackAnalyticsInfo from "../../../components/FeedbackAnalyticsInfo"
import Link from "../../../components/Link"
import { Switch, useColorModeValue } from "@chakra-ui/react"
import { useAnalytics } from "../../../hooks/useAnalytics"

const Settings: PageComponent = () => {
  const { isAnalyticsEnabled, enableAnalytics, disableAnalytics } =
    useAnalytics()

  const toggleAnalytics = () => {
    if (isAnalyticsEnabled) {
      disableAnalytics()
    } else {
      enableAnalytics()
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
      <Box display="flex" justifyContent="space-between">
        <FeedbackAnalyticsInfo m={0} mb={0} />
        <Box w="50%">
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
      </Box>
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
