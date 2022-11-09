import { PayloadAction } from "@reduxjs/toolkit/dist/createAction"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { CoingeckoID, Token } from "../../enums/token"
import {
  TokenState,
  SetTokenBalanceActionPayload,
  SetTokenLoadingActionPayload,
  SetTokenBalanceErrorActionPayload,
} from "../../types/token"
import { exchangeAPI } from "../../utils/exchangeAPI"
import Icon from "../../enums/icon"
import getUsdBalance from "../../utils/getUsdBalance"
import { startAppListening } from "../listener"
import { walletConnected } from "../account"
import { fetchTokenBalances } from "./effects"

export const fetchTokenPriceUSD = createAsyncThunk(
  "tokens/fetchTokenPriceUSD",
  async ({ token }: { token: Token }) => {
    const coingeckoID = CoingeckoID[token]
    const usd = await exchangeAPI.fetchCryptoCurrencyPriceUSD(coingeckoID)
    return { usd, token }
  }
)

export type TokensState = Record<Token, TokenState>

export const tokenSlice = createSlice({
  name: "tokens",
  initialState: {
    [Token.Keep]: {
      loading: false,
      balance: 0,
      text: Token.Keep,
      icon: Icon.KeepCircleBrand,
      usdConversion: 0,
      usdBalance: "0",
    },
    [Token.Nu]: {
      loading: false,
      balance: 0,
      text: Token.Nu,
      icon: Icon.NuCircleBrand,
      usdConversion: 0,
      usdBalance: "0",
    },
    [Token.T]: {
      loading: false,
      balance: 0,
      text: Token.T,
      icon: Icon.TCircleBrand,
      usdConversion: 0,
      usdBalance: "0",
    },
    [Token.TBTC]: {
      loading: false,
      balance: 0,
      usdConversion: 0,
      usdBalance: "0",
    },
    [Token.TBTCV2]: {
      loading: false,
      balance: 0,
      usdConversion: 0,
      usdBalance: "0",
    },
  } as TokensState,
  reducers: {
    setTokenLoading: (
      state,
      action: PayloadAction<SetTokenLoadingActionPayload>
    ) => {
      state[action.payload.token].loading = true
    },
    setTokenBalance: (
      state,
      action: PayloadAction<SetTokenBalanceActionPayload>
    ) => {
      const { token, balance } = action.payload
      state[token].loading = false
      state[token].balance = balance
      state[token].usdBalance = getUsdBalance(
        state[token].balance,
        state[token].usdConversion
      )
    },
    setTokenBalanceError: (
      state,
      action: PayloadAction<SetTokenBalanceErrorActionPayload>
    ) => {
      const { token } = action.payload
      state[token].loading = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTokenPriceUSD.fulfilled, (state, action) => {
      const { token, usd } = action.payload

      state[token].usdConversion = usd
      state[token].usdBalance = getUsdBalance(
        state[token].balance,
        state[token].usdConversion
      )
    })
  },
})

export const { setTokenBalance, setTokenLoading, setTokenBalanceError } =
  tokenSlice.actions

export const registerTokensListeners = () => {
  startAppListening({
    actionCreator: walletConnected,
    effect: fetchTokenBalances,
  })
}
registerTokensListeners()
