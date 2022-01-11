import { createSlice } from "@reduxjs/toolkit"

export const stakingSlice = createSlice({
  name: "staking",
  initialState: {
    operator: "",
    beneficiary: "",
    authorizer: "",
    stakeAmount: 0,
  },
  reducers: {
    updateState: (state, action) => {
      // @ts-ignore
      state[action.payload.key] = action.payload.value
    },
  },
})

export const { updateState } = stakingSlice.actions
