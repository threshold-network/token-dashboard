import { createSelector } from "@reduxjs/toolkit"
import { RootState } from ".."
import { StakeData } from "../../types/staking"
import { isSameETHAddress } from "../../web3/utils"

export const selectStakes = (state: RootState) => state.staking.stakes

export const selectStakingProviders = createSelector(selectStakes, (stakes) =>
  stakes.map((_) => _.stakingProvider)
)
export const selectStakeByStakingProvider = createSelector(
  [selectStakes, (_: RootState, stakingProvider: string) => stakingProvider],
  (stakes: StakeData[], stakingProvider: string) =>
    stakes.find((_) => isSameETHAddress(_.stakingProvider, stakingProvider))
)
