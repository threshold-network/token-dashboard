import { configureStore } from "@reduxjs/toolkit"
import { modalSlice } from "./modal"
import { tokenSlice } from "./tokens"

const store = configureStore({
  reducer: {
    modal: modalSlice.reducer,
    token: tokenSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export default store
