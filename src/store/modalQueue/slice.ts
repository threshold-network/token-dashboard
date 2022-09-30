import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { featureFlags } from "../../constants"

export interface ModalQueueState {
  isSuccessfullLoginModalClosed: boolean
  isMappingOperatorToStakingProviderModalClosed: boolean
}

/*
  Simplpified modal queue, we should think how to do it properly whenever we have more time
*/
export const modalQueueSlice = createSlice({
  name: "modal-queue",
  initialState: {
    isSuccessfullLoginModalClosed: false,
    isMappingOperatorToStakingProviderModalClosed: false,
  } as ModalQueueState,
  reducers: {
    successfullLoginModalClosed: (
      state: ModalQueueState,
      action: PayloadAction
    ) => {
      state.isSuccessfullLoginModalClosed = true
    },
    mapOperatorToStakingProviderModalClosed: (
      state: ModalQueueState,
      action: PayloadAction
    ) => {
      state.isMappingOperatorToStakingProviderModalClosed = true
    },
  },
})

export const {
  successfullLoginModalClosed,
  mapOperatorToStakingProviderModalClosed,
} = modalQueueSlice.actions
