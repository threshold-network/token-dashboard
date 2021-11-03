import { createSlice } from "@reduxjs/toolkit"
import { Token } from "../../enums/token"
import {
  ReduxTokenInfo,
  SetTokenBalanceActionPayload,
  SetTokenLoadingActionPayload,
} from "../../types/token"
import { PayloadAction } from "@reduxjs/toolkit/dist/createAction"

export const tokenSlice = createSlice({
  name: "tokens",
  initialState: {
    [Token.Keep]: {
      loading: false,
      balance: 0,
    },
    [Token.Nu]: {
      loading: false,
      balance: 0,
    },
  } as Record<Token, ReduxTokenInfo>,
  reducers: {
    setTokenLoading: (
      state,
      action: PayloadAction<SetTokenLoadingActionPayload>
    ) => {
      state[action.payload.token].loading = action.payload.loading
    },
    setTokenBalance: (
      state,
      action: PayloadAction<SetTokenBalanceActionPayload>
    ) => {
      state[action.payload.token].balance = action.payload.balance
    },
  },
})

export const { setTokenBalance, setTokenLoading } = tokenSlice.actions
