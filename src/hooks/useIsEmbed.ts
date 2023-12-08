import { useCallback } from "react"
import { useLocalStorage } from "./useLocalStorage"

export const useIsEmbed = () => {
  const [isEmbed, setIsEmbed] = useLocalStorage<boolean | undefined>(
    "isEmbed",
    undefined
  )
  const params = new URLSearchParams(window.location.search)

  const enableIsEmbed = useCallback(() => {
    if (params.get("embed")) {
      setIsEmbed(true)
    }
  }, [setIsEmbed, params])

  const disableIsEmbed = useCallback(() => {
    setIsEmbed(false)
  }, [setIsEmbed])

  return {
    enableIsEmbed,
    disableIsEmbed,
    isEmbed,
  }
}
