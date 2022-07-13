import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit/dist/createAction"
import { Zero } from "@ethersproject/constants"
import {
  BonusEligibility,
  InterimRewards,
  StakingBonusRewards,
} from "../../types"
import { getAddress } from "../../web3/utils"
import { isBetweenBonusDealineAndBonusDistribution } from "../../utils/stakingBonus"

interface BasicRewardsState<T> {
  isFetching: boolean
  hasFetched: boolean
  error: string
  rewards: T
  totalRewardsBalance: string
}

interface RewardsState {
  stakingBonus: BasicRewardsState<StakingBonusRewards>
  interim: BasicRewardsState<InterimRewards>
  totalRewardsBalance: string
}

export const rewardsSlice = createSlice({
  name: "rewards",
  initialState: {
    stakingBonus: {
      isFetching: false,
      hasFetched: false,
      error: "",
      rewards: {},
      totalRewardsBalance: "0",
    },
    interim: {
      isFetching: false,
      hasFetched: false,
      error: "",
      rewards: {},
      totalRewardsBalance: "0",
    },
    totalRewardsBalance: "0",
  } as RewardsState,
  reducers: {
    setInterimRewards: (
      state: RewardsState,
      action: PayloadAction<{ [stakingProvider: string]: string }>
    ) => {
      state.interim.rewards = action.payload
      state.interim.isFetching = false
      state.interim.hasFetched = true
      state.interim.totalRewardsBalance = calculateTotalInterimRewardsBalance(
        state.interim.rewards
      )
      state.totalRewardsBalance = calculateTotalRewardsBalance(state)
    },
    interimRewardsClaimed: (state: RewardsState) => {
      state.interim.rewards = {}
      state.interim.totalRewardsBalance = "0"
      for (const stakingProvider of Object.keys(state.stakingBonus.rewards))
        state.stakingBonus.rewards[stakingProvider] = {
          ...state.stakingBonus.rewards[stakingProvider],
          isRewardClaimed: true,
        }

      state.stakingBonus.totalRewardsBalance = calculateTotalBonusBalance(
        state.stakingBonus.rewards
      )
      state.totalRewardsBalance = calculateTotalRewardsBalance(state)
    },
    setStakingBonus: (
      state: RewardsState,
      action: PayloadAction<{ [stakingProvider: string]: BonusEligibility }>
    ) => {
      state.stakingBonus.rewards = action.payload
      state.stakingBonus.isFetching = false
      state.stakingBonus.hasFetched = true
      state.stakingBonus.totalRewardsBalance = calculateTotalBonusBalance(
        state.stakingBonus.rewards
      )
      state.totalRewardsBalance = calculateTotalRewardsBalance(state)
    },
    unstaked: (state: RewardsState, action: PayloadAction<string>) => {
      const stakingProvider = getAddress(action.payload)
      if (
        !state.stakingBonus.rewards.hasOwnProperty(stakingProvider) &&
        !isBetweenBonusDealineAndBonusDistribution()
      ) {
        return
      }

      state.stakingBonus.rewards[stakingProvider] = {
        ...state.stakingBonus.rewards[stakingProvider],
        isEligible: false,
        hasUnstakeAfterBonusDeadline: true,
      }
      state.stakingBonus.totalRewardsBalance = calculateTotalBonusBalance(
        state.stakingBonus.rewards
      )
      state.totalRewardsBalance = calculateTotalRewardsBalance(state)
    },
  },
})

const calculateTotalBonusBalance = (
  stakingBonusRewards: StakingBonusRewards
): string => {
  return Object.values(stakingBonusRewards)
    .reduce(
      (totalBalance, bonus) =>
        totalBalance.add(
          !bonus.isRewardClaimed && bonus.isEligible ? bonus.reward : "0"
        ),
      Zero
    )
    .toString()
}

const calculateTotalInterimRewardsBalance = (
  interimRewards: InterimRewards
): string => {
  return Object.values(interimRewards)
    .reduce((totalBalance, reward) => totalBalance.add(reward), Zero)
    .toString()
}

const calculateTotalRewardsBalance = (rewardsState: RewardsState) => {
  // The interim rewards already include the staking bonus so there is no need
  // to add the staking bonus here.
  return rewardsState.interim.totalRewardsBalance
}

export const {
  setInterimRewards,
  setStakingBonus,
  interimRewardsClaimed,
  unstaked,
} = rewardsSlice.actions
