import { useEffect } from "react"
import { featureFlags } from "../../constants"
import * as sentry from "../../sentry"

export const useSentry = () => {
  useEffect(() => {
    if (featureFlags.SENTRY) {
      sentry.init()
    }
  }, [])
}
