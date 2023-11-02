import { useWeb3React } from "@web3-react/core"
import { useContext, useMemo } from "react"
import { LedgerLiveAppContext } from "../contexts/LedgerLiveAppContext"
import { useEmbedFeatureFlag } from "./useEmbedFeatureFlag"
import { useLocalStorage } from "./useLocalStorage"

type UseIsActiveResult = {
  account: string | undefined
  isActive: boolean
}

/**
 * Checks if eth wallet is connected to the dashboard. It works with normal
 * view in the website and also inside Ledger Live App.
 * @return {UseIsActiveResult} Account address and `isActive` boolean
 */
export const useIsActive = (): UseIsActiveResult => {
  const { active, account } = useWeb3React()
  const { ethAddress } = useContext(LedgerLiveAppContext)
  const { isEmbed } = useEmbedFeatureFlag()

  const isActive = useMemo(() => {
    if (isEmbed) {
      return !!ethAddress
    }
    return !!active && !!account
  }, [ethAddress, active, account])

  return {
    account: (isEmbed ? ethAddress : account) || undefined,
    isActive,
  }
}
