import { createSelector } from "@reduxjs/toolkit"
import { RootState } from ".."

export const selectBridgeTransacionHistory = createSelector(
  (state: RootState) => state,
  (state) => {
    return state.tbtc.transactionsHistory.data
  }
)
