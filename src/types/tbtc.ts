import { UpdateStateActionPayload } from "./state"

export type TbtcStateKey =
  | "mintingStep"
  | "mintingType"
  | "btcRecoveryAddress"
  | "ethAddress"
  | "btcDepositAddress"
  | "hasDeclinedJSONFile"

export enum TbtcMintingType {
  mint = "MINT",
  unmint = "UNMINT",
}

export enum MintingStep {
  ProvideData = "PROVIDE_DATA",
  Deposit = "Deposit",
  InitiateMinting = "INITIATE_MINTING",
  MintingSuccess = "MINTING_SUCCESS",
}

export const MintingSteps: MintingStep[] = [
  MintingStep.ProvideData,
  MintingStep.Deposit,
  MintingStep.InitiateMinting,
  MintingStep.MintingSuccess,
]

export interface UpdateTbtcState {
  payload: UpdateStateActionPayload<TbtcStateKey>
}

export interface UseTbtcState {
  (): {
    mintingStep: MintingStep
    mintingType: TbtcMintingType
    btcDepositAddress: string
    btcRecoveryAddress: string
    ethAddress: string
    hasDeclinedJSONFile: boolean
    updateState: (key: TbtcStateKey, value: any) => UpdateTbtcState
  }
}
