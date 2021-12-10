import { createSlice } from "@reduxjs/toolkit"
import { Token } from "../../enums/token"
import {
  ReduxTokenInfo,
  SetTokenBalanceActionPayload,
  SetTokenLoadingActionPayload,
} from "../../types/token"
import { PayloadAction } from "@reduxjs/toolkit/dist/createAction"
import Threshold from "../../static/icons/Threshold"
import Keep from "../../static/icons/Keep"
import Nu from "../../static/icons/Nu"

export const tokenSlice = createSlice({
  name: "tokens",
  initialState: {
    [Token.Keep]: {
      loading: false,
      balance: 0,
      conversionRate: 4.87,
      text: Token.Keep,
      icon: Keep,
    },
    [Token.Nu]: {
      loading: false,
      balance: 0,
      conversionRate: 2.66,
      text: Token.Nu,
      icon: Nu,
    },
    [Token.T]: {
      loading: false,
      balance: 0,
      conversionRate: 1,
      text: Token.T,
      icon: Threshold,
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
