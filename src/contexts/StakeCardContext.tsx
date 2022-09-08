import React from "react"
import { createContext } from "react"

interface StakeCardContext {
  isInactiveStake: boolean
  canTopUpKepp: boolean
  canTopUpNu: boolean
  hasLegacyStakes: boolean
}

export const StakeCardContext = React.createContext<
  StakeCardContext | undefined
>(undefined)
