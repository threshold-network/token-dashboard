import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface ConnectedAccountState {
  address: string
}

export const connectedAccountSlice = createSlice({
  name: "connected-account",
  initialState: {
    address: "",
  } as ConnectedAccountState,
  reducers: {
    setConnectedAccountAddress: (
      state: ConnectedAccountState,
      action: PayloadAction<string>
    ) => {
      state.address = action.payload
    },
  },
})

export const { setConnectedAccountAddress } = connectedAccountSlice.actions
