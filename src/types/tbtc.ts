import { UpdateStateActionPayload } from "./state"

export type TbtcStateKey =
  | "mintingStep"
  | "mintingType"
  | "btcRecoveryAddress"
  | "ethAddress"
  | "btcDepositAddress"
  | "tBTCMintAmount"
  | "ethGasCost"
  | "thresholdNetworkFee"
  | "mintingFee"
  | "nextBridgeCrossingInUnix"
  | "walletPublicKeyHash"
  | "blindingFactor"
  | "refundLocktime"

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

    // deposit data
    btcRecoveryAddress: string
    ethAddress: string
    refundLocktime: string
    blindingFactor: string
    walletPublicKeyHash: string

    updateState: (key: TbtcStateKey, value: any) => UpdateTbtcState
    nextBridgeCrossingInUnix?: number

    // TODO: These may be incorrect types
    tBTCMintAmount: string
    ethGasCost: number
    thresholdNetworkFee: string
    mintingFee: string
    resetDepositData: () => void
  }
}
