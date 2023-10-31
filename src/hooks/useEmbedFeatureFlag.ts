import { useCallback } from "react"
import { useLocalStorage } from "./useLocalStorage"

export const useEmbedFeatureFlag = () => {
  const [isEmbed, setIsEmbed] = useLocalStorage<boolean | undefined>(
    "isEmbed",
    undefined
  )

  const enableIsEmbedFeatureFlag = useCallback(() => {
    setIsEmbed(true)
  }, [setIsEmbed])

  const disableIsEmbedFeatureFlag = useCallback(() => {
    setIsEmbed(false)
  }, [setIsEmbed])

  return {
    enableIsEmbedFeatureFlag,
    disableIsEmbedFeatureFlag,
    isEmbed,
  }
}
