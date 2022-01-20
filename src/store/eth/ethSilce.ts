import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { exchangeAPI } from "../../utils/exchangeAPI"
import { CoingeckoID } from "../../enums"
import { EthStateData } from "../../types"

export const fetchETHPriceUSD = createAsyncThunk(
  "eth/fetchETHPriceUSD",
  async () => {
    return await exchangeAPI.fetchCryptoCurrencyPriceUSD(CoingeckoID.ETH)
  }
)

// Store Ethereum data such as balance, balance in usd, gas price and
// other related data to Ethereum chain.
export const ethSlice = createSlice({
  name: "eth",
  initialState: {
    isLoadingPriceUSD: false,
    usdPrice: 0,
  } as EthStateData,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchETHPriceUSD.pending, (state) => {
      state.isLoadingPriceUSD = true
    })
    builder.addCase(fetchETHPriceUSD.fulfilled, (state, action) => {
      state.isLoadingPriceUSD = false
      state.usdPrice = action.payload
    })
  },
})
