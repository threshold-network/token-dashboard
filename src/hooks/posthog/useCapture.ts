import { useCallback } from "react"
import { PosthogEvent } from "../../types/posthog"
import { featureFlags } from "../../constants"
import * as posthog from "../../posthog"
import { useAnalytics } from "../useAnalytics"

export const useCapture = (
  eventName: PosthogEvent,
  overrideConsent = false
) => {
  const { isAnalyticsEnabled } = useAnalytics()

  return useCallback(
    (params) => {
      if (!featureFlags.POSTHOG) return

      if (overrideConsent) {
        if (!isAnalyticsEnabled) {
          posthog.init()
        }
        posthog.capture(eventName, params)
      } else if (isAnalyticsEnabled) {
        posthog.capture(eventName, params)
      }
    },
    [eventName, isAnalyticsEnabled]
  )
}
