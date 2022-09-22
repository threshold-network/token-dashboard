import { createContext } from "react"

interface StakeCardContext {
  isInactiveStake: boolean
  canTopUpKepp: boolean
  canTopUpNu: boolean
  hasLegacyStakes: boolean
  isPRESet: boolean
}

export const StakeCardContext = createContext<StakeCardContext | undefined>(
  undefined
)
