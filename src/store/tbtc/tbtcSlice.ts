import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit/dist/createAction"
import { TbtcMintAction } from "../../types/tbtc"

interface TbtcState {
  mintAction: TbtcMintAction
}

export const tbtcSlice = createSlice({
  name: "tbtc",
  initialState: {
    mintAction: TbtcMintAction.mint,
  } as TbtcState,
  reducers: {
    setMintAction: (
      state: TbtcState,
      action: PayloadAction<{ mintAction: TbtcMintAction }>
    ) => {
      state.mintAction = action.payload.mintAction
    },
  },
})

export const { setMintAction } = tbtcSlice.actions
