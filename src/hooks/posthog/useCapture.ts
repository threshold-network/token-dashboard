import { useCallback } from "react"
import { PosthogEvent } from "../../types/posthog"
import { featureFlags } from "../../constants"
import * as posthog from "../../posthog"
import { useAppSelector } from "../store"

export const useCapture = (eventName: PosthogEvent) => {
  const shouldEnableAnalytics = useAppSelector(
    (state) => state.analytics.shouldEnableAnalytics
  )

  return useCallback(
    (params) => {
      if (!featureFlags.POSTHOG) return
      if (!shouldEnableAnalytics) return
      posthog.capture(eventName, params)
    },
    [eventName, shouldEnableAnalytics]
  )
}
