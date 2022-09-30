import { createSlice, createAction } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit/dist/createAction"
import { BigNumber, BigNumberish } from "@ethersproject/bignumber"
import {
  ProviderStakedActionPayload,
  StakeData,
  StakingStateKey,
  UnstakedActionPayload,
  ToppedUpActionPayload,
} from "../../types/staking"
import { StakeType, TopUpType, UnstakeType } from "../../enums"
import { AddressZero } from "../../web3/utils"
import { UpdateStateActionPayload } from "../../types/state"
import { startAppListening } from "../listener"
import { fetchStakeByStakingProviderEffect } from "./effects"

interface StakingState {
  stakingProvider: string
  beneficiary: string
  authorizer: string
  stakeAmount: string
  stakes: StakeData[]
  stakedBalance: BigNumberish
  minStakeAmount: string | undefined
}

const calculateStakedBalance = (stakes: StakeData[]): BigNumberish => {
  return stakes.reduce(
    (balance, stake) =>
      BigNumber.from(balance).add(BigNumber.from(stake.totalInTStake)),
    BigNumber.from(0)
  )
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
    minStakeAmount: undefined,
  } as StakingState,
  reducers: {
    updateState: (
      state,
      action: PayloadAction<UpdateStateActionPayload<StakingStateKey>>
    ) => {
      // @ts-ignore
      state[action.payload.key] = action.payload.value
    },
    setStakes: (state, action) => {
      state.stakes = action.payload
      state.stakedBalance = calculateStakedBalance(action.payload)
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
      newStake.possibleKeepTopUpInT = "0"
      newStake.possibleNuTopUpInT = "0"

      newStake.preConfig = {
        operator: AddressZero,
        isOperatorConfirmed: false,
        operatorStartTimestamp: "0",
      }

      state.stakes = [newStake, ...state.stakes]
      state.stakedBalance = calculateStakedBalance(state.stakes)
    },
    providerStakedForStakingProvider: (state: StakingState, action) => {},
    toppedUp: (
      state: StakingState,
      action: PayloadAction<ToppedUpActionPayload>
    ) => {
      const { stakingProvider, amount, topUpType } = action.payload

      const stakes = state.stakes
      const stakeIdxToUpdate = stakes.findIndex(
        (stake: StakeData) => stake.stakingProvider === stakingProvider
      )

      if (stakeIdxToUpdate < 0) return

      const stake = stakes[stakeIdxToUpdate]

      if (topUpType === TopUpType.LEGACY_KEEP) {
        stakes[stakeIdxToUpdate].possibleKeepTopUpInT = "0"
      } else if (topUpType === TopUpType.LEGACY_NU) {
        stakes[stakeIdxToUpdate].possibleNuTopUpInT = "0"
      }

      const fieldName =
        topUpType === TopUpType.NATIVE
          ? "tStake"
          : topUpType === TopUpType.LEGACY_KEEP
          ? "keepInTStake"
          : "nuInTStake"

      stakes[stakeIdxToUpdate][fieldName] = BigNumber.from(
        stakes[stakeIdxToUpdate][fieldName]
      )
        .add(amount)
        .toString()

      const totalInTStake = BigNumber.from(stake.totalInTStake)
        .add(amount)
        .toString()

      stakes[stakeIdxToUpdate].totalInTStake = totalInTStake

      state.stakedBalance = calculateStakedBalance(state.stakes)
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

      state.stakedBalance = calculateStakedBalance(state.stakes)
    },
    setMinStake: (
      state: StakingState,
      action: PayloadAction<{ amount: string }>
    ) => {
      state.minStakeAmount = action.payload.amount
    },
  },
})

export const requestStakeByStakingProvider = createAction<{
  stakingProvider: string | undefined
}>("staking/request-stake-by-staking-provider")

export const {
  updateState,
  setStakes,
  providerStaked,
  providerStakedForStakingProvider,
  toppedUp,
  unstaked,
  setMinStake,
} = stakingSlice.actions

export const registerStakingListeners = () => {
  startAppListening({
    actionCreator: requestStakeByStakingProvider,
    effect: fetchStakeByStakingProviderEffect,
  })
}

registerStakingListeners()
