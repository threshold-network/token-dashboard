import { useCallback } from "react"
import { PosthogEvent } from "../../types/posthog"
import { featureFlags } from "../../constants"
import * as posthog from "../../posthog"
import { useAnalytics } from "../useAnalytics"

export const useCapture = (eventName: PosthogEvent) => {
  const { isAnalyticsEnabled } = useAnalytics()

  return useCallback(
    (params) => {
      if (!featureFlags.POSTHOG) return
      if (!isAnalyticsEnabled) return
      posthog.capture(eventName, params)
    },
    [eventName, isAnalyticsEnabled]
  )
}
