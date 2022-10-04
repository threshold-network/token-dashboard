import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ModalType } from "../../enums"

export interface ModalQueueState {
  isSuccessfullLoginModalClosed: boolean
  isMappingOperatorToStakingProviderModalClosed: boolean
}

export interface ModalState {
  modalType: ModalType | null
  props: any
  modalQueue: ModalQueueState
}

export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    modalType: null,
    props: {},
    modalQueue: {
      isSuccessfullLoginModalClosed: false,
      isMappingOperatorToStakingProviderModalClosed: false,
    },
  } as ModalState,
  reducers: {
    openModal: (
      state: ModalState,
      action: PayloadAction<{ modalType: ModalType; props?: any }>
    ) => {
      state.modalType = action.payload.modalType
      state.props = action.payload.props
    },
    closeModal: (state: ModalState) => {
      state.modalType = null
      state.props = {}
    },
    successfullLoginModalClosed: (state: ModalState) => {
      state.modalQueue.isSuccessfullLoginModalClosed = true
    },
    mapOperatorToStakingProviderModalClosed: (state: ModalState) => {
      state.modalQueue.isMappingOperatorToStakingProviderModalClosed = true
    },
  },
})

export const {
  openModal,
  closeModal,
  successfullLoginModalClosed,
  mapOperatorToStakingProviderModalClosed,
} = modalSlice.actions
