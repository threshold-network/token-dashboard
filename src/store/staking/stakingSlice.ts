import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit/dist/createAction"
import { StakeType } from "../../enums"
import {
  OperatorStakedActionPayload,
  StakeData,
  UpdateStakeAmountActionPayload,
  UpdateStateActionPayload,
} from "../../types/staking"
import { BigNumber } from "ethers"
import { fetchETHPriceUSD } from "../eth"
import { BigNumberish } from "@ethersproject/bignumber"

interface StakingState {
  operator: string
  beneficiary: string
  authorizer: string
  stakeAmount: string
  stakes: StakeData[]
  stakedBalance: BigNumberish
}

const calculateStakedBalance = (stakes: StakeData[]): BigNumberish => {
  return stakes.reduce(
    (balance, stake) =>
      BigNumber.from(balance).add(BigNumber.from(stake.tStake)),
    BigNumber.from(0)
  )
}

export const stakingSlice = createSlice({
  name: "staking",
  initialState: {
    operator: "",
    beneficiary: "",
    authorizer: "",
    stakeAmount: "0",
    stakes: [],
    stakedBalance: 0,
  } as StakingState,
  reducers: {
    updateState: (state, action: PayloadAction<UpdateStateActionPayload>) => {
      // @ts-ignore
      state[action.payload.key] = action.payload.value
    },
    setStakes: (state, action) => {
      state.stakes = action.payload
      state.stakedBalance = calculateStakedBalance(action.payload)
    },
    operatorStaked: (
      state,
      action: PayloadAction<OperatorStakedActionPayload>
    ) => {
      const eventData = action.payload
      const { amount, stakeType, ...restData } = eventData
      const _amount = amount.toString()
      const newStake = { ...restData } as StakeData
      newStake.stakeType = stakeType
      newStake.nuInTStake = stakeType === StakeType.NU ? _amount : "0"
      newStake.keepInTStake = stakeType === StakeType.KEEP ? _amount : "0"
      newStake.tStake = stakeType === StakeType.T ? _amount : "0"

      state.stakes = [newStake, ...state.stakes]
      state.stakedBalance = calculateStakedBalance(state.stakes)
    },
    updateStakeAmountForOperator: (
      state,
      action: PayloadAction<UpdateStakeAmountActionPayload>
    ) => {
      const { stakingProvider, amount, increaseOrDecrease } = action.payload

      const stakes = state.stakes
      const stakeIdxToUpdate = stakes.findIndex(
        (stake) => stake.stakingProvider === stakingProvider
      )

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

      state.stakedBalance = calculateStakedBalance(state.stakes)
    },
  },
})

export const {
  updateState,
  setStakes,
  operatorStaked,
  updateStakeAmountForOperator,
} = stakingSlice.actions
