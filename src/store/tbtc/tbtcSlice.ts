import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit/dist/createAction"
import {
  MintingStep,
  TbtcMintingType,
  TbtcStateKey,
  TbtcState,
} from "../../types/tbtc"
import { UpdateStateActionPayload } from "../../types/state"
import { BridgeActivityStatus, BridgeActivity } from "../../threshold-ts/tbtc"
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
    mintingType: TbtcMintingType.mint,
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
      }>
    ) => {
      const { amount, txHash, depositKey } = action.payload
      const history = state.bridgeActivity.data
      const { itemToUpdate } = findActivityByDepositKey(history, depositKey)

      // Do not update an array if there is already an item with the same
      // deposit key- just in case duplicated Ethereum events.
      if (itemToUpdate) return

      // Add item only if there is no item with the same deposit key.
      state.bridgeActivity.data = [
        { amount, txHash, status: BridgeActivityStatus.PENDING, depositKey },
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
  },
})

function findActivityByDepositKey(
  bridgeActivities: BridgeActivity[],
  depositKey: string
) {
  const activityIndexItemToUpdate = bridgeActivities.findIndex(
    (item) => item.depositKey === depositKey
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
