import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit/dist/createAction"
import { BonusEligibility } from "../../types/staking"

interface BasicRewardsState<T> {
  isFetching: boolean
  hasFetched: boolean
  error: string
  rewards: T
}

interface RewardsState {
  stakingBonus: BasicRewardsState<{
    [stakingProvider: string]: BonusEligibility
  }>
  interim: BasicRewardsState<{ [stakingProvider: string]: string }>
}

export const rewardsSlice = createSlice({
  name: "rewards",
  initialState: {
    // TODO: move the bonus eleigibility from the staking reducer to rewards.
    stakingBonus: {
      isFetching: false,
      hasFetched: false,
      error: "",
      rewards: {},
    },
    interim: { isFetching: false, hasFetched: false, error: "", rewards: {} },
  } as RewardsState,
  reducers: {
    setInterimRewards: (
      state: RewardsState,
      action: PayloadAction<{ [stakingProvider: string]: string }>
    ) => {
      state.interim.rewards = action.payload
      state.interim.isFetching = false
      state.interim.hasFetched = true
    },
  },
})

export const { setInterimRewards } = rewardsSlice.actions
