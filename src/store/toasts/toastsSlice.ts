import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ToastProps } from "../../hooks/useToast"

export interface ToastsState {
  [x: string]: ToastProps[]
}

export const toastsSlice = createSlice({
  name: "toasts",
  initialState: {} as ToastsState,
  reducers: {
    initializeInstance: (
      state: ToastsState,
      action: PayloadAction<{ instanceId: string }>
    ) => {
      const { instanceId } = action.payload
      if (state[instanceId]) {
        // Instance already exists
        return
      }
      state[instanceId] = []
    },
    addToast: (
      state: ToastsState,
      action: PayloadAction<{ instanceId: string; toastData: ToastProps }>
    ) => {
      const { instanceId, toastData } = action.payload
      state[instanceId] = [...state[instanceId], toastData]
    },
    removeToast: (
      state: ToastsState,
      action: PayloadAction<{ instanceId: string; index: number }>
    ) => {
      const { instanceId, index } = action.payload
      state[instanceId].splice(index, 1)
    },
  },
})

export const { initializeInstance, addToast, removeToast } = toastsSlice.actions
