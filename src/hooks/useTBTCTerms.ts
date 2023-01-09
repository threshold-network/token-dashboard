import { useCallback } from "react"
import { useLocalStorage } from "./useLocalStorage"

export const useTBTCTerms = () => {
  const [haveTermsBeenAccepted, setHaveTermsBeenAccepted] = useLocalStorage<
    boolean | undefined
  >("tBTCTerms", undefined)

  const accept = useCallback(() => {
    setHaveTermsBeenAccepted(true)
  }, [setHaveTermsBeenAccepted])

  const reject = useCallback(() => {
    setHaveTermsBeenAccepted(false)
  }, [setHaveTermsBeenAccepted])

  return {
    accept,
    reject,
    haveTermsBeenAccepted,
    hasUserResponded: typeof haveTermsBeenAccepted === "boolean",
  }
}
