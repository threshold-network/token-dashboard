import numeral from "numeral"
import axios from "axios"
import { FixedNumber } from "@ethersproject/bignumber"
import { formatUnits } from "@ethersproject/units"
import { PayloadAction } from "@reduxjs/toolkit/dist/createAction"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { CoingeckoID, Token } from "../../enums/token"
import {
  TokenState,
  SetTokenBalanceActionPayload,
  SetTokenConversionRateActionPayload,
  SetTokenLoadingActionPayload,
} from "../../types/token"
import { exchangeAPI } from "../../utils/exchangeAPI"
import Icon from "../../enums/icon"
import getUsdBalance from "../../utils/getUsdBalance"

export const fetchTokenPriceUSD = createAsyncThunk(
  "tokens/fetchTokenPriceUSD",
  async ({ token }: { token: Token }) => {
    const coingeckoID = CoingeckoID[token]
    const usd = await exchangeAPI.fetchCryptoCurrencyPriceUSD(coingeckoID)
    return { usd, token }
  }
)

export const tokenSlice = createSlice({
  name: "tokens",
  initialState: {
    [Token.Keep]: {
      loading: false,
      balance: 0,
      conversionRate: 4.87,
      text: Token.Keep,
      icon: Icon.KeepCircleBrand,
      usdConversion: 0,
      usdBalance: "0",
    },
    [Token.Nu]: {
      loading: false,
      balance: 0,
      conversionRate: 2.66,
      text: Token.Nu,
      icon: Icon.NuCircleBrand,
      usdConversion: 0,
      usdBalance: "0",
    },
    [Token.T]: {
      loading: false,
      balance: 0,
      conversionRate: 1,
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
  } as Record<Token, TokenState>,
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
      const { token, balance } = action.payload
      state[token].balance = balance
      state[token].usdBalance = getUsdBalance(
        state[token].balance,
        state[token].usdConversion
      )
    },
    setTokenConversionRate: (
      state,
      action: PayloadAction<SetTokenConversionRateActionPayload>
    ) => {
      const { token, conversionRate } = action.payload

      const formattedConversionRate = numeral(
        +conversionRate / 10 ** 15
      ).format("0.0000")

      state[token].conversionRate = formattedConversionRate
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

export const { setTokenBalance, setTokenLoading, setTokenConversionRate } =
  tokenSlice.actions
