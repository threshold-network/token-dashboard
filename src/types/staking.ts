import { BigNumberish } from "@ethersproject/bignumber"
import { StakeType } from "../enums"

export interface UpdateStateActionPayload {
  key: "authorizer" | "beneficiary" | "operator" | "stakeAmount"
  value: string | number
}

export interface UpdateState {
  payload: UpdateStateActionPayload
}

export interface UseReduxStaking {
  (): {
    stakeAmount: string | number
    operator: string
    beneficiary: string
    authorizer: string
    setOperator: (operator: string) => UpdateState
    setBeneficiary: (beneficiary: string) => UpdateState
    setAuthorizer: (authorizer: string) => UpdateState
    setStakeAmount: (amount: string | number) => UpdateState
    stakes: StakeData[]
  }
}

export interface StakeData {
  stakeType: StakeType
  owner: string
  operator: string
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
  operator: string
  beneficiary: string
  authorizer: string
  amount: BigNumberish
}

export type OperatorStakedActionPayload = OperatorStakedEvent &
  Omit<
    StakeData,
    "stakeType" | "nuInTStake" | "keepInTStake" | "tStake" | "amount"
  >
