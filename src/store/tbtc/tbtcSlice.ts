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

export interface TbtcState {
  mintingType: TbtcMintingType
  mintingStep: MintingStep
  unmintingStep: UnmintingStep
  ethAddress: string
  btcRecoveryAddress: string
  btcDepositAddress: string

  nextBridgeCrossing?: Date

  // TODO: These may be incorrect types
  tBTCMintAmount: number
  isLoadingTbtcMintAmount: boolean
  ethGasCost: number
  thresholdNetworkFee: number
  bitcoinMinerFee: number
  isLoadingBitcoinMinerFee: boolean
}

export const tbtcSlice = createSlice({
  name: "tbtc",
  initialState: {
    mintingType: TbtcMintingType.mint,
    mintingStep: MintingSteps[0],
  } as TbtcState,
  reducers: {
    updateState: (
      state,
      action: PayloadAction<UpdateStateActionPayload<TbtcStateKey>>
    ) => {
      // @ts-ignore
      state[action.payload.key] = action.payload.value
    },
  },
})

export const { updateState } = tbtcSlice.actions
