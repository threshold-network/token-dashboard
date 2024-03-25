export type TRMState = {
  isBlocked: boolean
  isFetching: boolean
  hasFetched: boolean
  error: string
}

export interface TRMAccountDetails {
  accountExternalId: string | null
  address: string
  addressRiskIndicators: TRMRiskIndicator[]
  addressSubmitted: string
  chain: string
  entities: TRMEntity[]
  trmAppUrl: string
}

export interface TRMRiskIndicator {
  category: string
  categoryId: string
  categoryRiskScoreLevel: number
  categoryRiskScoreLevelLabel: string
  incomingVolumeUsd: string
  outgoingVolumeUsd: string
  riskType: string
  totalVolumeUsd: string
}

export interface TRMEntity {
  category: string
  categoryId: string
  entity: string
  riskScoreLevel: number
  riskScoreLevelLabel: string
  trmAppUrl: string
  trmUrn: string
}
