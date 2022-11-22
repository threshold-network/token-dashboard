import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import * as posthog from "../../posthog"
import { featureFlags } from "../../constants"
import { useAppSelector } from "../store"

export const useCapturePageview = () => {
  const location = useLocation()
  const shouldEnableAnalytics = useAppSelector(
    (state) => state.analytics.shouldEnableAnalytics
  )

  useEffect(() => {
    if (featureFlags.POSTHOG && shouldEnableAnalytics) posthog.capturePageview()
  }, [location, shouldEnableAnalytics])
}
