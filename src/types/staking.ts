import { BigNumberish } from "@ethersproject/bignumber"
import { StakeType, UnstakeType } from "../enums"

export type StakingStateKey =
  | "authorizer"
  | "beneficiary"
  | "stakingProvider"
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
    totalRewardsBalance: string
    totalBonusBalance: string
    stakeAmount: string | number
    stakingProvider: string
    beneficiary: string
    authorizer: string
    updateState: (key: StakingStateKey, value: any) => UpdateState
  }
}

export interface BonusEligibility {
  hasPREConfigured: boolean
  hasActiveStake: boolean
  // No unstaking after the May 15th "snapshot" and until July 15th (not even
  // partial amounts).
  hasUnstakeAfterBonusDeadline: boolean
  // Only total staked amount before May 15th(May 15 2022 23:59:59) is taking
  // into account.
  eligibleStakeAmount: string
  reward: string
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
  totalInTStake: string
  bonusEligibility: BonusEligibility
}

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
    | "bonusEligibility"
  >

export type UpdateStakeAmountActionPayload = {
  stakingProvider: string
  amount: string | number
  increaseOrDecrease: "increase" | "decrease"
}

export type UnstakedActionPayload = Omit<
  UpdateStakeAmountActionPayload,
  "increaseOrDecrease"
> & {
  unstakeType: UnstakeType
}
export interface StakeCellProps {
  stake: StakeData
}
