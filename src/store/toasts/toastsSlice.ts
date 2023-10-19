import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ToastProps, ToastInternalProps } from "../../components/Toast/Toast"

type ToastData = Omit<ToastInternalProps, "onUnmount"> & ToastProps

export interface ToastsState {
  [x: string]: ToastData[]
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
      action: PayloadAction<{ instanceId: string; toastData: ToastData }>
    ) => {
      const { instanceId, toastData } = action.payload
      state[instanceId] = [...state[instanceId], toastData]
    },
    removeToast: (
      state: ToastsState,
      action: PayloadAction<{ instanceId: string; id?: number }>
    ) => {
      const { instanceId, id } = action.payload
      if (!id) {
        // Remove the last toast
        state[instanceId].pop()
        return
      }

      state[instanceId] = state[instanceId].filter(
        ({ id: idToCompare }) => idToCompare !== id
      )
    },
  },
})

export const { initializeInstance, addToast, removeToast } = toastsSlice.actions
