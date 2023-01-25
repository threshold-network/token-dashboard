import { useCallback } from "react"
import { featureFlags } from "../../constants"
import * as sentry from "../../sentry"

export const useCaptureMessage = () => {
  return useCallback((message: string, params: { [key: string]: unknown }) => {
    if (!featureFlags.SENTRY) return
    sentry.captureMessage(message, params)
  }, [])
}
