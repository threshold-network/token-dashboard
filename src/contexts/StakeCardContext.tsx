import { createContext } from "react"

export interface StakeCardContext {
  isInactiveStake: boolean
  canTopUpKepp: boolean
  canTopUpNu: boolean
  hasLegacyStakes: boolean
}

export const StakeCardContext = createContext<StakeCardContext>({
  isInactiveStake: false,
  canTopUpKepp: false,
  canTopUpNu: false,
  hasLegacyStakes: false,
})
