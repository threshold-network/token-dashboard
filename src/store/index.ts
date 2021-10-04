import { configureStore } from "@reduxjs/toolkit"
import { modalSlice } from "./modal"

const store = configureStore({
  reducer: {
    modal: modalSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export default store
