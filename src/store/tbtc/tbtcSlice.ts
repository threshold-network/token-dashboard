import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit/dist/createAction"
import {
  MintingStep,
  MintingSteps,
  TbtcMintingType,
  TbtcStateKey,
  UnmintingStep,
} from "../../types/tbtc"
import { UpdateStateActionPayload } from "../../types/state"
import { FetchingState } from "../../types"
import { BridgeHistoryStatus, BridgeTxHistory } from "../../threshold-ts/tbtc"
import { featureFlags } from "../../constants"
import { startAppListening } from "../listener"
import { fetchBridgeTxHitoryEffect } from "./effects"

interface TbtcState {
  mintingType: TbtcMintingType
  mintingStep: MintingStep
  unmintingStep: UnmintingStep
  btcWithdrawAddress: string
  unmintAmount: string
  btcDepositAddress: string

  //deposit data
  ethAddress: string
  btcRecoveryAddress: string
  walletPublicKeyHash: string
  refundLocktime: string
  blindingFactor: string

  nextBridgeCrossingInUnix?: number

  // TODO: These may be incorrect types
  tBTCMintAmount: string
  ethGasCost: number
  thresholdNetworkFee: string
  bitcoinMinerFee: string

  transactionsHistory: FetchingState<BridgeTxHistory[]>
}

export const tbtcSlice = createSlice({
  name: "tbtc",
  initialState: {
    mintingType: TbtcMintingType.mint,
    mintingStep: MintingSteps[0],
    transactionsHistory: {
      isFetching: false,
      error: "",
      data: [] as BridgeTxHistory[],
    },
  } as TbtcState,
  reducers: {
    updateState: (
      state,
      action: PayloadAction<UpdateStateActionPayload<TbtcStateKey>>
    ) => {
      // @ts-ignore
      state[action.payload.key] = action.payload.value
    },
    requestBridgeTransactionHistory: (
      state,
      action: PayloadAction<{ depositor: string }>
    ) => {},
    fetchingBridgeTransactionHistory: (state) => {
      state.transactionsHistory.isFetching = true
    },
    bridgeTransactionHistoryFetched: (
      state,
      action: PayloadAction<BridgeTxHistory[]>
    ) => {
      state.transactionsHistory.isFetching = false
      state.transactionsHistory.error = ""
      state.transactionsHistory.data = action.payload
    },
    bridgeTransactionHistoryFailed: (
      state,
      action: PayloadAction<{ error: string }>
    ) => {
      state.transactionsHistory.isFetching = false
      state.transactionsHistory.error = action.payload.error
    },
    depositRevealed: (
      state,
      action: PayloadAction<{
        fundingTxHash: string
        fundingOutputIndex: number
        depositKey: string
        amount: string
        depositor: string
        txHash: string
      }>
    ) => {
      const { amount, txHash, depositKey } = action.payload
      state.transactionsHistory.data = [
        { amount, txHash, status: BridgeHistoryStatus.PENDING, depositKey },
        ...state.transactionsHistory.data,
      ]
    },
    optimisticMintingFinalized: (
      state,
      action: PayloadAction<{
        depositKey: string
        txHash: string
      }>
    ) => {
      const { depositKey, txHash } = action.payload
      const history = state.transactionsHistory.data
      const historyIndexItemToUpdate = history.findIndex(
        (item) => item.depositKey === depositKey
      )

      if (historyIndexItemToUpdate < 0) return

      const historyItemToUpdate =
        state.transactionsHistory.data[historyIndexItemToUpdate]

      state.transactionsHistory.data[historyIndexItemToUpdate] = {
        ...historyItemToUpdate,
        status: BridgeHistoryStatus.MINTED,
        txHash,
      }
    },
  },
})

export const { updateState } = tbtcSlice.actions

const registerTBTCListeners = () => {
  if (!featureFlags.TBTC_V2) return

  startAppListening({
    actionCreator: tbtcSlice.actions.requestBridgeTransactionHistory,
    effect: fetchBridgeTxHitoryEffect,
  })
}

// TODO: Move to the `../listener` file once we merge
// https://github.com/threshold-network/token-dashboard/pull/302.
registerTBTCListeners()
