import { createSlice } from "@reduxjs/toolkit"
import { ModalType } from "../../enums"

export interface modalState {
  modalType: ModalType | null
  props: any
}

export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    modalType: null,
    props: {},
  } as modalState,
  reducers: {
    openModal: (state, action) => {
      state.modalType = action.payload.modalType
      state.props = action.payload.props
    },
    closeModal: (state) => {
      state.modalType = null
      state.props = {}
    },
  },
})

export const { openModal, closeModal } = modalSlice.actions
