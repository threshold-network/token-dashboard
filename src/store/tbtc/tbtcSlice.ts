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
  isLoadingTbtcMintAmount: boolean
  ethGasCost: number
  thresholdNetworkFee: string
  bitcoinMinerFee: string
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
