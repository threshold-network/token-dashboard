import { BigNumberish } from "@ethersproject/bignumber"
import { StakeType } from "../enums"

export type StakingStateKey =
  | "authorizer"
  | "beneficiary"
  | "operator"
  | "stakeAmount"

export interface UpdateStateActionPayload {
  key: StakingStateKey
  value: string | number
}

export interface UpdateState {
  payload: UpdateStateActionPayload
}

export interface UseStakingState {
  (): {
    stakedBalance: BigNumberish
    stakes: StakeData[]
    stakeAmount: string | number
    operator: string
    beneficiary: string
    authorizer: string
    updateState: (key: StakingStateKey, value: any) => UpdateState
  }
}

export interface StakeData {
  stakeType: StakeType
  owner: string
  stakingProvider: string
  beneficiary: string
  authorizer: string
  blockNumber: number
  blockHash: string
  transactionHash: string
  nuInTStake: string
  keepInTStake: string
  tStake: string
}

export interface OperatorStakedEvent {
  stakeType: number
  owner: string
  stakingProvider: string
  beneficiary: string
  authorizer: string
  amount: BigNumberish
}

export type OperatorStakedActionPayload = OperatorStakedEvent &
  Omit<
    StakeData,
    "stakeType" | "nuInTStake" | "keepInTStake" | "tStake" | "amount"
  >

export type UpdateStakeAmountActionPayload = {
  stakingProvider: string
  amount: string | number
  increaseOrDecrease: "increase" | "decrease"
}

export interface StakeCellProps {
  stake: StakeData
}
