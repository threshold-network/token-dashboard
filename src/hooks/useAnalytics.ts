import { useLocalStorage } from "@rehooks/local-storage"

export const useAnalytics = () => {
  const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useLocalStorage<
    boolean | undefined
  >("isAnalyticsEnabled")

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
