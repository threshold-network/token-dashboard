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
    minStakeAmount: string
  }
}

export interface BonusEligibility {
  hasPREConfigured: boolean
  hasActiveStake: boolean
  // No unstaking after the bonus deadline and until mid-July (not even partial
  // amounts).
  hasUnstakeAfterBonusDeadline: boolean
  // Only total staked amount before bonus deadline is taking
  // into account.
  eligibleStakeAmount: string
  reward: string
}

export interface PreConfig {
  operator: string
  isOperatorConfirmed: boolean
  operatorStartTimestamp: string
}

export interface PreConfigData {
  [stakingProvider: string]: PreConfig
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
  preConfig: PreConfig
  possibleKeepTopUpInT: string
  possibleNuTopUpInT: string
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
    | "preConfig"
    | "possibleKeepTopUpInT"
    | "possibleNuTopUpInT"
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
