import { createSelector } from "@reduxjs/toolkit"
import { RootState } from ".."

export const selectBridgeActivity = createSelector(
  (state: RootState) => state,
  (state) => {
    return state.tbtc.bridgeActivity.data
  }
)
