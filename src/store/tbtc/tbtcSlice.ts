import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit/dist/createAction"
import { MintingStep, MintingSteps, TbtcMintAction } from "../../types/tbtc"

interface TbtcState {
  mintAction: TbtcMintAction
  mintingStep: MintingStep
  mintingStepIdx: number
}

export const tbtcSlice = createSlice({
  name: "tbtc",
  initialState: {
    mintAction: TbtcMintAction.mint,
    mintingStep: MintingSteps[0],
    mintingStepIdx: 0,
  } as TbtcState,
  reducers: {
    advanceMintingStep: (state: TbtcState) => {
      if (state.mintingStepIdx < MintingSteps.length - 1) {
        const newStepIdx = state.mintingStepIdx + 1
        state.mintingStepIdx = newStepIdx
        state.mintingStep = MintingSteps[newStepIdx]
      }
    },
    rewindMintingStep: (state: TbtcState) => {
      if (state.mintingStepIdx > 0) {
        const newStepIdx = state.mintingStepIdx - 1
        state.mintingStepIdx = newStepIdx
        state.mintingStep = MintingSteps[newStepIdx]
      }
    },
    setMintAction: (
      state: TbtcState,
      action: PayloadAction<{ mintAction: TbtcMintAction }>
    ) => {
      state.mintAction = action.payload.mintAction
    },
  },
})

export const { setMintAction, rewindMintingStep, advanceMintingStep } =
  tbtcSlice.actions
