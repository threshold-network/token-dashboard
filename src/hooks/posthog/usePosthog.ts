import { useEffect } from "react"
import { featureFlags } from "../../constants"
import * as posthog from "../../posthog"
import { useCapturePageview } from "./useCapturePageview"
import { useIdentify } from "./useIdentify"
import { useAnalytics } from "../useAnalytics"

export const usePosthog = () => {
  const { isAnalyticsEnabled } = useAnalytics()

  useEffect(() => {
    if (featureFlags.POSTHOG && isAnalyticsEnabled) {
      posthog.init()
    }
  }, [isAnalyticsEnabled])

  useCapturePageview()
  useIdentify()
}
