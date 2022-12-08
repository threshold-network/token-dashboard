import { useLocalStorage } from "./useLocalStorage"
import { useCallback } from "react"

export const useAnalytics = () => {
  const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useLocalStorage<
    boolean | undefined
  >("isAnalyticsEnabled", undefined)

  const enableAnalytics = useCallback(() => {
    setIsAnalyticsEnabled(true)
  }, [setIsAnalyticsEnabled])

  const disableAnalytics = useCallback(() => {
    setIsAnalyticsEnabled(false)
  }, [setIsAnalyticsEnabled])

  return {
    isAnalyticsEnabled,
    hasUserResponded: typeof isAnalyticsEnabled === "boolean",
    enableAnalytics,
    disableAnalytics,
  }
}
