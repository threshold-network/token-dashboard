import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RolesOf } from "../../threshold-ts/staking"
import { isSameETHAddress } from "../../web3/utils"
import { startAppListening } from "../listener"
import {
  providerStaked,
  providerStakedForStakingProvider,
  setStakes,
} from "../staking"
import { getRolesOf } from "./effects"

interface ConnectedAccountState {
  address: string
  rolesOf: RolesOf
}

export const connectedAccountSlice = createSlice({
  name: "connected-account",
  initialState: {
    address: "",
    rolesOf: {
      owner: "",
      authorizer: "",
      beneficiary: "",
    },
  } as ConnectedAccountState,
  reducers: {
    setConnectedAccountAddress: (
      state: ConnectedAccountState,
      action: PayloadAction<string>
    ) => {
      state.address = action.payload
    },
    setRolesOf: (
      state: ConnectedAccountState,
      action: PayloadAction<RolesOf>
    ) => {
      state.rolesOf.owner = action.payload.owner
      state.rolesOf.authorizer = action.payload.authorizer
      state.rolesOf.beneficiary = action.payload.beneficiary
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

        if (isSameETHAddress(stakingProvider, address)) {
          state.rolesOf = {
            owner,
            beneficiary,
            authorizer,
          }
        }
      }
    )
  },
})

startAppListening({
  actionCreator: setStakes,
  effect: getRolesOf,
})

export const { setConnectedAccountAddress, setRolesOf } =
  connectedAccountSlice.actions
