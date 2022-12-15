import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import * as posthog from "../../posthog"
import { featureFlags } from "../../constants"
import { useAnalytics } from "../useAnalytics"

export const useCapturePageview = () => {
  const location = useLocation()
  const { isAnalyticsEnabled } = useAnalytics()

  useEffect(() => {
    if (featureFlags.POSTHOG && isAnalyticsEnabled) posthog.capturePageview()
  }, [location, isAnalyticsEnabled])
}
