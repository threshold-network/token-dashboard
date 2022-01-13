export type StakingStateKey =
  | "authorizer"
  | "beneficiary"
  | "operator"
  | "stakeAmount"

export interface UpdateStateActionPayload {
  key: StakingStateKey
  value: string
}

export interface UpdateState {
  payload: UpdateStateActionPayload
}

export interface UseStakingState {
  (): {
    stakingState: {
      stakeAmount: string | number
      operator: string
      beneficiary: string
      authorizer: string
    }
    updateState: (key: StakingStateKey, value: any) => UpdateState
  }
}
