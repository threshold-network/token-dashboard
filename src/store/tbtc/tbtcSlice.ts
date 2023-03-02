import { AsyncThunk, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit/dist/createAction"
import {
  MintingStep,
  TbtcMintingType,
  TbtcStateKey,
  TbtcState,
} from "../../types/tbtc"
import { UpdateStateActionPayload } from "../../types/state"
import { BridgeHistoryStatus, BridgeTxHistory } from "../../threshold-ts/tbtc"
import { featureFlags } from "../../constants"
import { startAppListening } from "../listener"
import {
  fetchBridgeTxHitoryEffect,
  findUtxoEffect,
  fetchUtxoConfirmationsEffect,
} from "./effects"
import { curveAPI } from "../../utils/curveAPI"
import { CurveFactoryPoolId } from "../../enums"

export type CurvePoolData = {
  url: string
  address: string
  apy: number[]
  tvl: number
}

export const fetchCurveFactoryPoolData: AsyncThunk<CurvePoolData, void, {}> =
  createAsyncThunk("tbtc/fetchFactoryPool", async () => {
    const factoryPool = await curveAPI.fetchFactoryPool(
      CurveFactoryPoolId.TBTC_WBTC_SBTC
    )

    return {
      address: factoryPool.address,
      url: factoryPool.poolUrls.deposit[0],
      apy: factoryPool.gaugeCrvApy,
      // TODO: fetch tvl
      tvl: 0,
    }
  })

export const tbtcSlice = createSlice({
  name: "tbtc",
  initialState: {
    mintingType: TbtcMintingType.mint,
    mintingStep: MintingStep.ProvideData,
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
      const history = state.transactionsHistory.data
      const { itemToUpdate } = findHistoryByDepositKey(history, depositKey)

      // Do not update an array if there is already an item with the same
      // deposit key- just in case duplicated Ethereum events.
      if (itemToUpdate) return

      // Add item only if there is no item with the same deposit key.
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
      const {
        index: historyIndexItemToUpdate,
        itemToUpdate: historyItemToUpdate,
      } = findHistoryByDepositKey(history, depositKey)

      if (!historyItemToUpdate) return

      state.transactionsHistory.data[historyIndexItemToUpdate] = {
        ...historyItemToUpdate,
        status: BridgeHistoryStatus.MINTED,
        txHash,
      }
    },
    findUtxo: (
      state,
      action: PayloadAction<{
        btcDepositAddress: string
        depositor: string
      }>
    ) => {},
    fetchUtxoConfirmations: (
      state,
      action: PayloadAction<{
        utxo: {
          transactionHash: string
          value: string
        }
      }>
    ) => {},
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurveFactoryPoolData.fulfilled, (state, action) => {
      const curveFactoryPool = action.payload

      state.curveTBTCPool = curveFactoryPool
    })
  },
})

function findHistoryByDepositKey(
  history: BridgeTxHistory[],
  depositKey: string
) {
  const historyIndexItemToUpdate = history.findIndex(
    (item) => item.depositKey === depositKey
  )

  if (historyIndexItemToUpdate < 0) return { index: -1, itemToUpdate: null }

  const historyItemToUpdate = history[historyIndexItemToUpdate]

  return { index: historyIndexItemToUpdate, itemToUpdate: historyItemToUpdate }
}

export const { updateState } = tbtcSlice.actions

export const registerTBTCListeners = () => {
  if (!featureFlags.TBTC_V2) return

  startAppListening({
    actionCreator: tbtcSlice.actions.requestBridgeTransactionHistory,
    effect: fetchBridgeTxHitoryEffect,
  })

  startAppListening({
    actionCreator: tbtcSlice.actions.findUtxo,
    effect: findUtxoEffect,
  })

  startAppListening({
    actionCreator: tbtcSlice.actions.fetchUtxoConfirmations,
    effect: fetchUtxoConfirmationsEffect,
  })
}

// TODO: Move to the `../listener` file once we merge
// https://github.com/threshold-network/token-dashboard/pull/302.
registerTBTCListeners()
