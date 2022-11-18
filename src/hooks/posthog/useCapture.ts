import { useCallback } from "react"
import { posthogEvent } from "../../types/types"
import { featureFlags } from "../../constants"
import * as posthog from "../../posthog"

export const useCapture = (eventName: posthogEvent) => {
  return useCallback(
    (params) => {
      if (!featureFlags.POSTHOG) return
      posthog.capture(eventName, params)
    },
    [eventName]
  )
}
