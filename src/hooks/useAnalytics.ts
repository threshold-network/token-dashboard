import { useLocalStorage } from "./useLocalStorage"

export const useAnalytics = () => {
  const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useLocalStorage(
    "isAnalyticsEnabled",
    false
  )

  const enableAnalytics = () => {
    setIsAnalyticsEnabled(true)
  }

  const disableAnalytics = () => {
    setIsAnalyticsEnabled(false)
  }

  return {
    isAnalyticsEnabled,
    enableAnalytics,
    disableAnalytics,
  }
}
