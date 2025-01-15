export type TrmState = {
  isFetching: boolean
  hasFetched: boolean
  error: string
}

export interface TrmPayload {
  error: boolean
  message: string
  data: TrmAccountData
}

export interface TrmAccountData {
  isBlocked: boolean
  reason: string
  rawData: TrmAccountDetails[]
}

export interface TrmAccountDetails {
  accountExternalId: string | null
  address: string
  addressRiskIndicators: TrmRiskIndicator[]
  addressSubmitted: string
  chain: string
  entities: TrmEntity[]
  trmAppUrl: string
}

export interface TrmRiskIndicator {
  category: string
  categoryId: string
  categoryRiskScoreLevel: number
  categoryRiskScoreLevelLabel: string
  incomingVolumeUsd: string
  outgoingVolumeUsd: string
  riskType: string
  totalVolumeUsd: string
}

export interface TrmEntity {
  category: string
  categoryId: string
  entity: string
  riskScoreLevel: number
  riskScoreLevelLabel: string
  trmAppUrl: string
  trmUrn: string
}
