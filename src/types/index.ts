export * from "./array"
export * from "./modal"
export * from "./wallet"
export * from "./sidebar"
export * from "./token"
export * from "./eth"
export * from "./page"
export * from "./rewards"
export * from "./staking"
export * from "./staking-applications"
export * from "./tbtc"

export type FetchingState<DataType> = {
  isInitialFetchDone?: boolean
  isFetching: boolean
  error: string
  data: DataType
}

export type RangeOperatorType =
  | "greater"
  | "less"
  | "greaterOrEqual"
  | "lessOrEqual"

export type CurrencyType = "BTC" | "ETH" | "tBTC" | "SOL"
