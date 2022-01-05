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
    updateProps: (state, action) => {
      state.props = {
        ...state.props,
        ...action.payload,
      }
    },
  },
})

export const { openModal, closeModal, updateProps } = modalSlice.actions
