import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit/dist/createAction"
import { BigNumber, BigNumberish } from "@ethersproject/bignumber"
import {
  ProviderStakedActionPayload,
  StakeData,
  UnstakedActionPayload,
  UpdateStakeAmountActionPayload,
  UpdateStateActionPayload,
} from "../../types/staking"
import { StakeType, UnstakeType } from "../../enums"
import {
  calculateStakingBonusReward,
  isBeforeOrEqualBonusDeadline,
} from "../../utils/stakingBonus"
import { AddressZero } from "../../web3/utils"

interface StakingState {
  stakingProvider: string
  beneficiary: string
  authorizer: string
  stakeAmount: string
  stakes: StakeData[]
  stakedBalance: BigNumberish
  totalRewardsBalance: string
  totalBonusBalance: string
  minStakeAmount: string
}

const calculateStakedBalance = (stakes: StakeData[]): BigNumberish => {
  return stakes.reduce(
    (balance, stake) =>
      BigNumber.from(balance).add(BigNumber.from(stake.totalInTStake)),
    BigNumber.from(0)
  )
}

const calculateTotalBonusBalance = (stakes: StakeData[]): string => {
  const totalEligibleStakeAmount = stakes
    .reduce(
      (balance, stake) =>
        balance.add(
          BigNumber.from(stake.bonusEligibility.eligibleStakeAmount || "0")
        ),
      BigNumber.from(0)
    )
    .toString()

  return calculateStakingBonusReward(totalEligibleStakeAmount)
}

const calculateTotalRewardsBalance = (stakingState: StakingState) => {
  // Currently, the total rewards balance is equal to bonus balance.
  return stakingState.totalBonusBalance
}

export const stakingSlice = createSlice({
  name: "staking",
  initialState: {
    stakingProvider: "",
    beneficiary: "",
    authorizer: "",
    stakeAmount: "0",
    stakes: [],
    stakedBalance: 0,
    totalRewardsBalance: "0",
    totalBonusBalance: "0",
    minStakeAmount: "0",
  } as StakingState,
  reducers: {
    updateState: (state, action: PayloadAction<UpdateStateActionPayload>) => {
      // @ts-ignore
      state[action.payload.key] = action.payload.value
    },
    setStakes: (state, action) => {
      state.stakes = action.payload
      state.stakedBalance = calculateStakedBalance(action.payload)
      state.totalBonusBalance = calculateTotalBonusBalance(state.stakes)
      state.totalRewardsBalance = calculateTotalRewardsBalance(state)
    },
    providerStaked: (
      state,
      action: PayloadAction<ProviderStakedActionPayload>
    ) => {
      const eventData = action.payload
      const { amount, stakeType, ...restData } = eventData
      const _amount = amount.toString()
      const newStake = { ...restData } as StakeData
      newStake.stakeType = stakeType
      newStake.nuInTStake = stakeType === StakeType.NU ? _amount : "0"
      newStake.keepInTStake = stakeType === StakeType.KEEP ? _amount : "0"
      newStake.tStake = stakeType === StakeType.T ? _amount : "0"
      newStake.totalInTStake = _amount

      const _isBeforeOrEqualBonusDeadline = isBeforeOrEqualBonusDeadline()
      newStake.bonusEligibility = {
        eligibleStakeAmount: _isBeforeOrEqualBonusDeadline ? _amount : "0",
        hasPREConfigured: false,
        hasActiveStake: _isBeforeOrEqualBonusDeadline,
        hasUnstakeAfterBonusDeadline: false,
        reward: calculateStakingBonusReward(_amount),
      }

      newStake.preConfig = {
        operator: AddressZero,
        isOperatorConfirmed: false,
        operatorStartTimestamp: "0",
      }

      state.stakes = [newStake, ...state.stakes]
      state.stakedBalance = calculateStakedBalance(state.stakes)
      state.totalBonusBalance = calculateTotalBonusBalance(state.stakes)
      state.totalRewardsBalance = calculateTotalRewardsBalance(state)
    },
    updateStakeAmountForProvider: (
      state,
      action: PayloadAction<UpdateStakeAmountActionPayload>
    ) => {
      const { stakingProvider, amount, increaseOrDecrease } = action.payload

      const stakes = state.stakes
      const stakeIdxToUpdate = stakes.findIndex(
        (stake) => stake.stakingProvider === stakingProvider
      )

      if (stakeIdxToUpdate < 0) return

      const stake = stakes[stakeIdxToUpdate]

      const originalStakeAmount = BigNumber.from(
        stakes[stakeIdxToUpdate].tStake
      )

      const amountUnstaked = BigNumber.from(amount)

      if (increaseOrDecrease === "increase") {
        stakes[stakeIdxToUpdate].tStake = originalStakeAmount
          .add(amountUnstaked)
          .toString()
      } else if (increaseOrDecrease === "decrease") {
        stakes[stakeIdxToUpdate].tStake = originalStakeAmount
          .sub(amountUnstaked)
          .toString()
      }

      const totalInTStake = BigNumber.from(stake.tStake)
        .add(BigNumber.from(stake.keepInTStake))
        .add(BigNumber.from(stake.nuInTStake))
        .toString()

      stakes[stakeIdxToUpdate].totalInTStake = totalInTStake

      const _isBeforeOrEqualBonusDeadline = isBeforeOrEqualBonusDeadline()
      const eligibleStakeAmount = _isBeforeOrEqualBonusDeadline
        ? totalInTStake
        : state.stakes[stakeIdxToUpdate].bonusEligibility.eligibleStakeAmount
      state.stakes[stakeIdxToUpdate].bonusEligibility = {
        ...state.stakes[stakeIdxToUpdate].bonusEligibility,
        eligibleStakeAmount,
        reward: calculateStakingBonusReward(eligibleStakeAmount),
      }

      state.stakedBalance = calculateStakedBalance(state.stakes)
      state.totalBonusBalance = calculateTotalBonusBalance(state.stakes)
      state.totalRewardsBalance = calculateTotalRewardsBalance(state)
    },
    unstaked: (state, action: PayloadAction<UnstakedActionPayload>) => {
      const { stakingProvider, amount, unstakeType } = action.payload

      const stakes = state.stakes
      const stakeIdxToUpdate = stakes.findIndex(
        (stake) => stake.stakingProvider === stakingProvider
      )

      if (stakeIdxToUpdate < 0) return

      if (unstakeType === UnstakeType.ALL) {
        stakes[stakeIdxToUpdate].tStake = "0"
        stakes[stakeIdxToUpdate].keepInTStake = "0"
        stakes[stakeIdxToUpdate].nuInTStake = "0"
      } else if (unstakeType === UnstakeType.LEGACY_KEEP) {
        // The `TTokenStaking` allows only to unstake all KEEP tokens so we can
        // set `keepInTStake` to `0`.
        stakes[stakeIdxToUpdate].keepInTStake = "0"
      } else if (
        unstakeType === UnstakeType.LEGACY_NU ||
        unstakeType === UnstakeType.NATIVE
      ) {
        const fieldName =
          unstakeType === UnstakeType.LEGACY_NU ? "nuInTStake" : "tStake"
        const originalNuStakeAmount = BigNumber.from(
          stakes[stakeIdxToUpdate][fieldName]
        )
        stakes[stakeIdxToUpdate][fieldName] = originalNuStakeAmount
          .sub(amount)
          .toString()
      }

      const totalStaked = state.stakes[stakeIdxToUpdate].totalInTStake
      const newTotalStakedAmount = BigNumber.from(totalStaked)
        .sub(amount)
        .toString()
      state.stakes[stakeIdxToUpdate].totalInTStake = newTotalStakedAmount

      const _isBeforeOrEqualBonusDeadline = isBeforeOrEqualBonusDeadline()
      const eligibleStakeAmount = _isBeforeOrEqualBonusDeadline
        ? newTotalStakedAmount
        : "0"
      state.stakes[stakeIdxToUpdate].bonusEligibility = {
        ...state.stakes[stakeIdxToUpdate].bonusEligibility,
        eligibleStakeAmount,
        hasActiveStake: _isBeforeOrEqualBonusDeadline,
        hasUnstakeAfterBonusDeadline: !_isBeforeOrEqualBonusDeadline,
        reward: calculateStakingBonusReward(eligibleStakeAmount),
      }
      state.stakedBalance = calculateStakedBalance(state.stakes)
      state.totalBonusBalance = calculateTotalBonusBalance(state.stakes)
      state.totalRewardsBalance = calculateTotalRewardsBalance(state)
    },
    setMinStake: (
      state: StakingState,
      action: PayloadAction<{ amount: string }>
    ) => {
      state.minStakeAmount = action.payload.amount
    },
  },
})

export const {
  updateState,
  setStakes,
  providerStaked,
  updateStakeAmountForProvider,
  unstaked,
  setMinStake,
} = stakingSlice.actions
