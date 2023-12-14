import { useCallback } from "react"
import { useLocalStorage } from "./useLocalStorage"

export const useIsEmbed = () => {
  const [isEmbed, setIsEmbed] = useLocalStorage<boolean | undefined>(
    "isEmbed",
    undefined
  )

  const enableIsEmbed = useCallback(() => {
    setIsEmbed(true)
  }, [setIsEmbed])

  const disableIsEmbed = useCallback(() => {
    setIsEmbed(false)
  }, [setIsEmbed])

  return {
    enableIsEmbed,
    disableIsEmbed,
    isEmbed,
  }
}
