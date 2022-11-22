import { useEffect } from "react"
import { featureFlags } from "../../constants"
import * as posthog from "../../posthog"
import { useCapturePageview } from "./useCapturePageview"
import { useIdentify } from "./useIdentify"
import { useAppSelector } from "../store"

export const usePosthog = () => {
  const shouldEnableAnalytics = useAppSelector(
    (state) => state.analytics.shouldEnableAnalytics
  )

  useEffect(() => {
    if (featureFlags.POSTHOG && shouldEnableAnalytics) posthog.init()
  }, [shouldEnableAnalytics])

  useCapturePageview()
  useIdentify()
}
