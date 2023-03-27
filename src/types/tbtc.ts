import { UnspentTransactionOutput } from "@keep-network/tbtc-v2.ts/dist/src/bitcoin"
import { UpdateStateActionPayload } from "./state"
import { FetchingState } from "."
import { BridgeActivity } from "../threshold-ts/tbtc"

export interface TbtcState {
  mintingStep: MintingStep
  unmintingStep: UnmintingStep
  mintingType: TbtcMintingType

  // deposit data
  btcRecoveryAddress: string
  btcDepositAddress: string
  ethAddress: string
  refundLocktime: string
  blindingFactor: string
  walletPublicKeyHash: string
  utxo: UnspentTransactionOutput
  txConfirmations: number
  nextBridgeCrossingInUnix?: number
  depositRevealedTxHash?: string
  optimisticMintingRequestedTxHash?: string
  optimisticMintingFinalizedTxHash?: string
  tBTCMintAmount: string
  thresholdNetworkFee: string
  mintingFee: string

  bridgeActivity: FetchingState<BridgeActivity[]>
}

export type TbtcStateKey = keyof Omit<TbtcState, "bridgeActivity">

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
    updateState: (key: TbtcStateKey, value: any) => UpdateTbtcState
    resetDepositData: () => void
  } & TbtcState
}

export type ExternalPoolData = {
  poolName: string
  url: string
  address: string
  apy: number[]
  tvl: number
}
