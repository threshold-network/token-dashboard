export * from "./modal"
export * from "./utils"
export * from "./wallet"
export * from "./sidebar"
export * from "./token"
export * from "./eth"
export * from "./page"
export * from "./rewards"
export * from "./staking"
export * from "./staking-applications"

export type FetchingState<DataType> = {
  isInitialFetchDone?: boolean
  isFetching: boolean
  error: string
  data: DataType
}
