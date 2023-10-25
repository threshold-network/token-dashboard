import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit/dist/createAction"
import { MintingStep, TbtcStateKey, TbtcState } from "../../types/tbtc"
import { UpdateStateActionPayload } from "../../types/state"
import {
  BridgeActivityStatus,
  BridgeActivity,
  UnmintBridgeActivityAdditionalData,
} from "../../threshold-ts/tbtc"
import { featureFlags } from "../../constants"
import { startAppListening } from "../listener"
import {
  fetchBridgeactivityEffect,
  findUtxoEffect,
  fetchUtxoConfirmationsEffect,
} from "./effects"

export const tbtcSlice = createSlice({
  name: "tbtc",
  initialState: {
    mintingStep: MintingStep.ProvideData,
    bridgeActivity: {
      isFetching: false,
      error: "",
      data: [] as BridgeActivity[],
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
    requestBridgeActivity: (
      state,
      action: PayloadAction<{ depositor: string }>
    ) => {},
    fetchingBridgeActivity: (state) => {
      state.bridgeActivity.isFetching = true
    },
    bridgeActivityFetched: (state, action: PayloadAction<BridgeActivity[]>) => {
      state.bridgeActivity.isFetching = false
      state.bridgeActivity.error = ""
      state.bridgeActivity.data = action.payload
    },
    bridgeActivityFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.bridgeActivity.isFetching = false
      state.bridgeActivity.error = action.payload.error
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
        blockNumber: number
      }>
    ) => {
      const { amount, txHash, depositKey, blockNumber } = action.payload
      const history = state.bridgeActivity.data
      const { itemToUpdate } = findActivityByDepositKey(history, depositKey)

      // Do not update an array if there is already an item with the same
      // deposit key- just in case duplicated Ethereum events.
      if (itemToUpdate) return

      // Add item only if there is no item with the same deposit key.
      state.bridgeActivity.data = [
        {
          amount,
          txHash,
          status: BridgeActivityStatus.PENDING,
          activityKey: depositKey,
          bridgeProcess: "mint",
          blockNumber,
        },
        ...state.bridgeActivity.data,
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
      const history = state.bridgeActivity.data
      const {
        index: historyIndexItemToUpdate,
        itemToUpdate: historyItemToUpdate,
      } = findActivityByDepositKey(history, depositKey)

      if (!historyItemToUpdate) return

      state.bridgeActivity.data[historyIndexItemToUpdate] = {
        ...historyItemToUpdate,
        status: BridgeActivityStatus.MINTED,
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
    redemptionRequested: (
      state,
      action: PayloadAction<{
        redemptionKey: string
        blockNumber: number
        amount: string
        txHash: string
        additionalData: UnmintBridgeActivityAdditionalData
      }>
    ) => {
      const {
        payload: { amount, redemptionKey, blockNumber, txHash, additionalData },
      } = action

      const { itemToUpdate } = findRedemptionActivity(
        state.bridgeActivity.data,
        redemptionKey,
        txHash
      )

      // Do not update an array if there is already an item with the same
      // redemption key and transaction hash- just in case duplicated Ethereum
      // events.
      if (itemToUpdate) return

      // Add item only if there is no item with the same deposit key.
      state.bridgeActivity.data = [
        {
          amount,
          txHash,
          status: BridgeActivityStatus.PENDING,
          activityKey: redemptionKey,
          bridgeProcess: "unmint",
          blockNumber,
          additionalData,
        },
        ...state.bridgeActivity.data,
      ]
    },
    redemptionCompleted: (
      state,
      action: PayloadAction<{
        redemptionKey: string
        redemptionRequestedTxHash: string
      }>
    ) => {
      const {
        payload: { redemptionKey, redemptionRequestedTxHash },
      } = action

      const { itemToUpdate, index } = findRedemptionActivity(
        state.bridgeActivity.data,
        redemptionKey,
        redemptionRequestedTxHash
      )

      if (!itemToUpdate) return

      state.bridgeActivity.data[index] = {
        ...itemToUpdate,
        activityKey: redemptionKey,
        txHash: redemptionRequestedTxHash,
        status: BridgeActivityStatus.UNMINTED,
      }
    },
  },
})

function findActivityByDepositKey(
  bridgeActivities: BridgeActivity[],
  depositKey: string
) {
  const activityIndexItemToUpdate = bridgeActivities.findIndex(
    (item) => item.activityKey === depositKey
  )

  if (activityIndexItemToUpdate < 0) return { index: -1, itemToUpdate: null }

  const activityItemToUpdate = bridgeActivities[activityIndexItemToUpdate]

  return {
    index: activityIndexItemToUpdate,
    itemToUpdate: activityItemToUpdate,
  }
}

function findRedemptionActivity(
  bridgeActivities: BridgeActivity[],
  redemptionKey: string,
  txHash: string
) {
  const activityIndexItemToUpdate = bridgeActivities.findIndex(
    (item) => item.activityKey === redemptionKey && item.txHash === txHash
  )

  if (activityIndexItemToUpdate < 0) return { index: -1, itemToUpdate: null }

  const activityItemToUpdate = bridgeActivities[activityIndexItemToUpdate]

  return {
    index: activityIndexItemToUpdate,
    itemToUpdate: activityItemToUpdate,
  }
}

export const { updateState } = tbtcSlice.actions

export const registerTBTCListeners = () => {
  if (!featureFlags.TBTC_V2) return

  startAppListening({
    actionCreator: tbtcSlice.actions.requestBridgeActivity,
    effect: fetchBridgeactivityEffect,
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
