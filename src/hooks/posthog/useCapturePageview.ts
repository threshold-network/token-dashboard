import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import * as posthog from "../../posthog"
import { featureFlags } from "../../constants"

export const useCapturePageview = () => {
  const location = useLocation()

  useEffect(() => {
    if (featureFlags.POSTHOG) posthog.capturePageview()
  }, [location])
}
