import { configureStore } from "@reduxjs/toolkit"
import { modalSlice } from "./modal"
import { tokenSlice } from "./tokens"
import { sidebarSlice } from "./sidebar"

const store = configureStore({
  reducer: {
    modal: modalSlice.reducer,
    token: tokenSlice.reducer,
    sidebar: sidebarSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export default store
