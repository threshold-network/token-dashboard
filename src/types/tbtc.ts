import { BitcoinUtxo } from "@keep-network/tbtc-v2.ts"
import { FetchingState } from "."
import { BridgeActivity, BridgeProcess } from "../threshold-ts/tbtc"
import { UpdateStateActionPayload } from "./state"
import { NetworkName } from "../networks/types/networks"

export interface TbtcState {
  mintingStep: MintingStep
  // deposit data
  depositor: string
  btcRecoveryAddress: string
  btcDepositAddress: string
  ethAddress: string
  refundLocktime: string
  blindingFactor: string
  walletPublicKeyHash: string
  utxo: BitcoinUtxo
  txConfirmations: number
  nextBridgeCrossingInUnix?: number
  depositRevealedTxHash?: string
  optimisticMintingRequestedTxHash?: string
  optimisticMintingFinalizedTxHash?: string
  tBTCMintAmount: string
  thresholdNetworkFee: string
  crossChainFee: string
  mintingFee: string
  chainName: NetworkName
  extraData?: string

  bridgeActivity: FetchingState<BridgeActivity[]>
}

export type TbtcStateKey = keyof Omit<TbtcState, "bridgeActivity">

export enum MintingStep {
  ProvideData = "PROVIDE_DATA",
  Deposit = "DEPOSIT",
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

export { type BridgeProcess }
