import { createSelector } from "@reduxjs/toolkit"
import { RootState } from ".."

export const selectStakingProviders = createSelector(
  (state: RootState) => state.staking.stakes,
  (stakes) => stakes.map((_) => _.stakingProvider)
)
