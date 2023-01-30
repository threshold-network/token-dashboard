import { useCallback } from "react"
import { featureFlags } from "../../constants"
import * as sentry from "../../sentry"
import { Primitive } from "@sentry/types"

export const useCaptureMessage = () => {
  return useCallback(
    (
      message: string,
      params?: { [key: string]: unknown },
      tags?: { [key: string]: Primitive }
    ) => {
      if (!featureFlags.SENTRY) return
      sentry.captureMessage(message, params, tags)
    },
    []
  )
}
