import { UpdateStateActionPayload } from "./state"

export type TbtcStateKey =
  | "mintingStep"
  | "mintingType"
  | "btcRecoveryAddress"
  | "ethAddress"
  | "btcDepositAddress"
  | "tBTCMintAmount"
  | "isLoadingTbtcMintAmount"
  | "ethGasCost"
  | "thresholdNetworkFee"
  | "bitcoinMinerFee"
  | "isLoadingBitcoinMinerFee"
  | "nextBridgeCrossingInUnix"

export enum TbtcMintingType {
  mint = "MINT",
  unmint = "UNMINT",
}

export enum MintingStep {
  ProvideData = "PROVIDE_DATA",
  Deposit = "DEPOSIT",
  InitiateMinting = "INITIATE_MINTING",
  MintingSuccess = "MINTING_SUCCESS",
}

export enum UnmintingStep {
  ProvideData = "PROVIDE_DATA",
  Success = "SUCCESS",
}

export const MintingSteps: MintingStep[] = [
  MintingStep.ProvideData,
  MintingStep.Deposit,
  MintingStep.InitiateMinting,
  MintingStep.MintingSuccess,
]

export const UnmintingSteps: UnmintingStep[] = [
  UnmintingStep.ProvideData,
  UnmintingStep.Success,
]

export interface UpdateTbtcState {
  payload: UpdateStateActionPayload<TbtcStateKey>
}

export interface UseTbtcState {
  (): {
    mintingStep: MintingStep
    unmintingStep: UnmintingStep
    mintingType: TbtcMintingType
    btcWithdrawAddress: string
    unmintAmount: string
    btcDepositAddress: string
    btcRecoveryAddress: string
    ethAddress: string
    updateState: (key: TbtcStateKey, value: any) => UpdateTbtcState
    nextBridgeCrossingInUnix?: number

    // TODO: These may be incorrect types
    tBTCMintAmount: number
    isLoadingTbtcMintAmount: boolean
    ethGasCost: number
    thresholdNetworkFee: number
    bitcoinMinerFee: number
    isLoadingBitcoinMinerFee: boolean
  }
}

export enum TbtcTransactionResult {
  PENDING = "PENDING",
  UNMINTED = "UNMINTED",
  ERROR = "ERROR",
  MINTED = "MINTED",
}
