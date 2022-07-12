import { UpdateStateActionPayload } from "./state"
import { TbtcState } from "../store/tbtc"

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
  | "nextBridgeCrossing"

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
  (): TbtcState & {
    updateState: (key: TbtcStateKey, value: any) => UpdateTbtcState
  }
}

export enum TbtcTransactionResult {
  PENDING = "PENDING",
  UNMINTED = "UNMINTED",
  ERROR = "ERROR",
  MINTED = "MINTED",
}
