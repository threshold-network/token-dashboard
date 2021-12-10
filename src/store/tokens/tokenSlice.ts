import numeral from "numeral"
import axios from "axios"
import { FixedNumber } from "@ethersproject/bignumber"
import { formatUnits } from "@ethersproject/units"
import { PayloadAction } from "@reduxjs/toolkit/dist/createAction"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { CoingeckoID, Token } from "../../enums/token"
import {
  ReduxTokenInfo,
  SetTokenBalanceActionPayload,
  SetTokenLoadingActionPayload,
} from "../../types/token"
import Threshold from "../../static/icons/Threshold"
import Keep from "../../static/icons/Keep"
import Nu from "../../static/icons/Nu"

export const fetchTokenPriceUSD = createAsyncThunk(
  "tokens/fetchTokenPriceUSD",
  async ({ token }: { token: Token }) => {
    const coingeckoID = CoingeckoID[token]
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoID}&vs_currencies=usd`
    )
    // @ts-ignore
    return { usd: response.data[coingeckoID].usd, token }
  }
)

export const tokenSlice = createSlice({
  name: "tokens",
  initialState: {
    [Token.Keep]: {
      loading: false,
      balance: 0,
      formattedBalance: 0,
      conversionRate: 4.87,
      text: Token.Keep,
      icon: Keep,
      usdConversion: 0,
      usdBalance: "0",
    },
    [Token.Nu]: {
      loading: false,
      balance: 0,
      formattedBalance: 0,
      conversionRate: 2.66,
      text: Token.Nu,
      icon: Nu,
      usdConversion: 0,
      usdBalance: "0",
    },
    [Token.T]: {
      loading: false,
      balance: 0,
      formattedBalance: 0,
      conversionRate: 1,
      text: Token.T,
      icon: Threshold,
      usdConversion: 0,
      usdBalance: "0",
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
      const { token, balance, formattedBalance } = action.payload
      state[token].balance = balance
      state[token].formattedBalance = formattedBalance
      state[token].usdBalance = getUsdBalance(
        state[token].balance,
        state[token].usdConversion
      )
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

const getUsdBalance = (
  balance: string | number,
  usdConversion: number
): string => {
  return numeral(
    FixedNumber.fromString(usdConversion.toString())
      .mulUnsafe(FixedNumber.fromString(formatUnits(balance)))
      .toString()
  ).format("$0,0.00")
}

export const { setTokenBalance, setTokenLoading } = tokenSlice.actions
