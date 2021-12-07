import { configureStore } from "@reduxjs/toolkit"
import { modalSlice } from "./modal"
import { tokenSlice } from "./tokens"
import { sidebarSlice } from "./sidebar"
import { transactionSlice } from "./transactions"

const store = configureStore({
  reducer: {
    modal: modalSlice.reducer,
    token: tokenSlice.reducer,
    sidebar: sidebarSlice.reducer,
    transaction: transactionSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export default store
