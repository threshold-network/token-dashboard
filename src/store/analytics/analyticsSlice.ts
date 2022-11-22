import { createSlice } from "@reduxjs/toolkit"

export interface AnalyticsState {
  shouldEnableAnalytics: boolean
}

export const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    shouldEnableAnalytics: false,
  } as AnalyticsState,
  reducers: {
    optIn: (state: AnalyticsState) => {
      state.shouldEnableAnalytics = true
    },
    optOut: (state: AnalyticsState) => {
      state.shouldEnableAnalytics = false
    },
  },
})

export const { optIn, optOut } = analyticsSlice.actions
