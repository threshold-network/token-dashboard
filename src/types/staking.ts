export interface UpdateStateActionPayload {
  key: "authorizer" | "beneficiary" | "operator"
  value: string
}

export interface UpdateState {
  payload: UpdateStateActionPayload
}

export interface UseStakingState {
  (): {
    stakeAmount: string | number
    operator: string
    beneficiary: string
    authorizer: string
    setOperator: (operator: string) => UpdateState
    setBeneficiary: (beneficiary: string) => UpdateState
    setAuthorizer: (authorizer: string) => UpdateState
    setStakeAmount: (amount: string | number) => UpdateState
  }
}
