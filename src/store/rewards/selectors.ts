import { createSelector } from "@reduxjs/toolkit"
import { RootState } from ".."
import { BonusEligibility } from "../../types"

export const selectTotalRewardsBalance = (state: RootState) =>
  state.rewards.totalRewardsBalance

export const selectTotalBonusBalance = (state: RootState) =>
  state.rewards.stakingBonus.totalRewardsBalance

const selectBonusRewards = (state: RootState) =>
  state.rewards.stakingBonus.rewards
const selectInterimRewards = (state: RootState) => state.rewards.interim.rewards

export const selectRewardsByStakingProvider = createSelector(
  [
    selectBonusRewards,
    selectInterimRewards,
    (_: RootState, stakingProvider: string) => stakingProvider,
  ],
  (
    bonusRewards: { [stakingProvider: string]: BonusEligibility },
    interimRewards: { [stakingProvider: string]: string },
    stakingProvider: string
  ) => {
    const interim = interimRewards[stakingProvider] || "0"

    const bonus =
      bonusRewards[stakingProvider] &&
      !bonusRewards[stakingProvider].isRewardClaimed &&
      bonusRewards[stakingProvider].isEligible
        ? bonusRewards[stakingProvider].reward
        : "0"
    return {
      interim,
      bonus,
      // The rewards JSON file already includes the staking bonus so there is no
      // need to add staking bonus to total rewards balance.
      total: interim,
    }
  }
)
