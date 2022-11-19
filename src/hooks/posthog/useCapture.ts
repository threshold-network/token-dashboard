import { useCallback } from "react"
import { PosthogEvent } from "../../types/posthog"
import { featureFlags } from "../../constants"
import * as posthog from "../../posthog"

export const useCapture = (eventName: PosthogEvent) => {
  return useCallback(
    (params) => {
      if (!featureFlags.POSTHOG) return
      posthog.capture(eventName, params)
    },
    [eventName]
  )
}
