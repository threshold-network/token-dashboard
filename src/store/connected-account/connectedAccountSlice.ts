import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { providerStaked, providerStakedForStakingProvider } from "../staking"

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
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: AnyAction) =>
        action.type.match(providerStakedForStakingProvider),
      (state, action: ReturnType<typeof providerStaked>) => {
        const { owner, beneficiary, authorizer, stakingProvider } =
          action.payload

        const { address } = state

        // TODO: Fix this when refactoring "Staked" listener for provider

        // if (isSameETHAddress(stakingProvider, address)) {
        //   state.rolesOf = {
        //     owner,
        //     beneficiary,
        //     authorizer,
        //   }
        // }
      }
    )
  },
})

export const { setConnectedAccountAddress } = connectedAccountSlice.actions
