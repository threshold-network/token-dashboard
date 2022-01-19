import { createSlice } from "@reduxjs/toolkit"

export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    modalType: null,
    props: {},
  },
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
