import { useLocalStorage } from "../hooks/useLocalStorage"

export const useAnalytics = () => {
  const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useLocalStorage<
    boolean | undefined
  >("isAnalyticsEnabled", undefined)

  const enableAnalytics = () => {
    setIsAnalyticsEnabled(true)
  }

  const disableAnalytics = () => {
    setIsAnalyticsEnabled(false)
  }

  return {
    isAnalyticsEnabled,
    hasUserResponded: typeof isAnalyticsEnabled === "boolean",
    enableAnalytics,
    disableAnalytics,
  }
}
