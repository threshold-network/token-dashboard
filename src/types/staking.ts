import { BigNumberish } from "@ethersproject/bignumber"
import { TopUpType, UnstakeType } from "../enums"
import { Stake } from "../threshold-ts/staking"
import { UpdateStateActionPayload } from "./state"

export type StakingStateKey =
  | "authorizer"
  | "beneficiary"
  | "stakingProvider"
  | "stakeAmount"

export interface UpdateStakingState {
  payload: UpdateStateActionPayload<StakingStateKey>
}

export interface UseStakingState {
  (): {
    stakedBalance: BigNumberish
    stakes: StakeData[]
    stakeAmount: string | number
    stakingProvider: string
    beneficiary: string
    authorizer: string
    updateState: (key: StakingStateKey, value: any) => UpdateStakingState
    minStakeAmount: string | undefined
  }
}

export interface StakeData extends Stake<string> {}

export interface ProviderStakedEvent {
  stakeType: number
  owner: string
  stakingProvider: string
  beneficiary: string
  authorizer: string
  amount: BigNumberish
}

export type ProviderStakedActionPayload = ProviderStakedEvent &
  Omit<
    StakeData,
    | "stakeType"
    | "nuInTStake"
    | "keepInTStake"
    | "tStake"
    | "amount"
    | "totalInTStake"
    | "possibleKeepTopUpInT"
    | "possibleNuTopUpInT"
  >

export type UpdateStakeAmountActionPayload = {
  stakingProvider: string
  amount: string | number
}

export type UnstakedActionPayload = UpdateStakeAmountActionPayload & {
  unstakeType: UnstakeType
}

export type ToppedUpActionPayload = UpdateStakeAmountActionPayload & {
  topUpType: TopUpType
}
