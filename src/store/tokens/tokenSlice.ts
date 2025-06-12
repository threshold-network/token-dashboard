import numeral from "numeral"
import { BigNumber } from "ethers"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CoingeckoID, Token } from "../../enums/token"
import {
  TokenState,
  SetTokenBalanceActionPayload,
  SetTokenConversionRateActionPayload,
  SetTokenLoadingActionPayload,
  SetTokenIsLoadedFromConnectedAccountActionPayload,
} from "../../types/token"
import { exchangeAPI } from "../../utils/exchangeAPI"
import getUsdBalance from "../../utils/getUsdBalance"
import { safeBigNumber } from "../../utils/safeBigNumber"

export const fetchTokenPriceUSD = createAsyncThunk(
  "tokens/fetchTokenPriceUSD",
  async ({ token }: { token: Token }) => {
    const coingeckoID = CoingeckoID[token]
    const usd = await exchangeAPI.fetchCryptoCurrencyPriceUSD(coingeckoID)
    return { usd, token }
  }
)

const toUsdBalance = (token: TokenState) => {
  // Handle empty or invalid balance
  const balance = token.balance || "0"
  const balanceStr = balance.toString().trim()

  if (!balanceStr || balanceStr === "") {
    return "0"
  }

  try {
    const amount = BigNumber.from(10)
      .pow(18 - (token.decimals ?? 18)) // cast all to 18 decimals
      .mul(safeBigNumber(balanceStr))
      .toString()

    return getUsdBalance(amount, token.usdConversion)
  } catch (error) {
    console.warn("Failed to convert token balance to USD:", error)
    return "0"
  }
}

export const tokenSlice = createSlice({
  name: "tokens",
  initialState: {
    [Token.Keep]: {
      loading: false,
      isLoadedFromConnectedAccount: false,
      balance: 0,
      conversionRate: 4.87,
      text: Token.Keep,
      icon: "KEEP_CIRCLE_BRAND",
      usdConversion: 0,
      usdBalance: "0",
    },
    [Token.Nu]: {
      loading: false,
      isLoadedFromConnectedAccount: false,
      balance: 0,
      conversionRate: 2.66,
      text: Token.Nu,
      icon: "NU_CIRCLE_BRAND",
      usdConversion: 0,
      usdBalance: "0",
    },
    [Token.T]: {
      loading: false,
      isLoadedFromConnectedAccount: false,
      balance: 0,
      conversionRate: 1,
      text: Token.T,
      icon: "T_CIRCLE_BRAND",
      usdConversion: 0,
      usdBalance: "0",
    },
    [Token.TBTC]: {
      loading: false,
      isLoadedFromConnectedAccount: false,
      balance: 0,
      usdConversion: 0,
      usdBalance: "0",
    },
    [Token.TBTCV2]: {
      loading: false,
      isLoadedFromConnectedAccount: false,
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
    setTokenIsLoadedFromConnectedAccount: (
      state,
      action: PayloadAction<SetTokenIsLoadedFromConnectedAccountActionPayload>
    ) => {
      state[action.payload.token].isLoadedFromConnectedAccount =
        action.payload.isLoadedFromConnectedAccount
    },
    setTokenBalance: (
      state,
      action: PayloadAction<SetTokenBalanceActionPayload>
    ) => {
      const { token, balance } = action.payload
      state[token].balance = balance
      state[token].usdBalance = toUsdBalance(state[token])
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
      state[token].usdBalance = toUsdBalance(state[token])
    })
  },
})

export const {
  setTokenBalance,
  setTokenLoading,
  setTokenIsLoadedFromConnectedAccount,
  setTokenConversionRate,
} = tokenSlice.actions
