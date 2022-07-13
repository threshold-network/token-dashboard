import { createSelector } from "@reduxjs/toolkit"
import { BigNumber } from "ethers"
import { RootState } from ".."
import { BonusEligibility } from "../../types"
import { selectStakes } from "../staking"

export const selectTotalRewardsBalance = (state: RootState) =>
  state.rewards.totalRewardsBalance

export const selectTotalBonusBalance = (state: RootState) =>
  state.rewards.stakingBonus.totalRewardsBalance

const selectBonusRewards = (state: RootState) =>
  state.rewards.stakingBonus.rewards

export const selectInterimRewards = (state: RootState) =>
  state.rewards.interim.rewards

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

export const selectAccumulatedRewardsPerBeneficiary = createSelector(
  [selectInterimRewards, selectStakes],
  (rewards, stakes) => {
    const beneficiaryRewards: { [beneficiary: string]: string } = {}
    for (const stake of stakes) {
      if (!rewards[stake.stakingProvider]) {
        continue
      }
      const reward = rewards[stake.stakingProvider]
      const prevAmount = BigNumber.from(
        beneficiaryRewards[stake.beneficiary] || "0"
      )
      beneficiaryRewards[stake.beneficiary] = prevAmount.add(reward).toString()
    }

    return beneficiaryRewards
  }
)
