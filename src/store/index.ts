import { configureStore } from "@reduxjs/toolkit"
import { modalSlice } from "./modal"
import { tokenSlice } from "./tokens"
import { sidebarSlice } from "./sidebar"
import { transactionSlice } from "./transactions"
import { stakingSlice } from "./staking"
import { ethSlice } from "./eth"

const store = configureStore({
  reducer: {
    modal: modalSlice.reducer,
    token: tokenSlice.reducer,
    sidebar: sidebarSlice.reducer,
    transaction: transactionSlice.reducer,
    staking: stakingSlice.reducer,
    eth: ethSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["modal/updateProps", "modal/openModal"],
        // Ignore these field paths in all actions
        ignoredPaths: [
          "modal.props.setOperator",
          "modal.props.setBeneficiary",
          "modal.props.setAuthorizer",
          "modal.props.onSubmit",
          "modal.props.setAmountToStake",
          "payload.props.setAmountToStake",
        ],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>

export default store
