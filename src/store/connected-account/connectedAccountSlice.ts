import { AddressZero } from "@ethersproject/constants"
import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { featureFlags } from "../../constants"
import { FetchingState } from "../../types"
import { isSameETHAddress } from "../../web3/utils"
import { startAppListening } from "../listener"
import {
  providerStaked,
  providerStakedForStakingProvider,
  setStakes,
} from "../staking"
import { StakingAppName } from "../staking-applications"
import { getStakingProviderOperatorInfo } from "./effects"

interface ConnectedAccountState {
  address: string
  operatorMapping: FetchingState<{
    isUsedAsStakingProvider: boolean
    mappedOperators: {
      tbtc: string
      randomBeacon: string
    }
  }>
}

export const connectedAccountSlice = createSlice({
  name: "connected-account",
  initialState: {
    address: "",
    operatorMapping: {
      data: {
        isUsedAsStakingProvider: false,
        mappedOperators: {
          tbtc: AddressZero,
          randomBeacon: AddressZero,
        },
      },
      isFetching: false,
      isInitialFetchDone: false,
    },
  } as ConnectedAccountState,
  reducers: {
    setConnectedAccountAddress: (
      state: ConnectedAccountState,
      action: PayloadAction<string>
    ) => {
      state.address = action.payload
    },
    accountUsedAsStakingProvider: (
      state: ConnectedAccountState,
      action: PayloadAction
    ) => {
      state.operatorMapping.data.isUsedAsStakingProvider = true
    },
    setMappedOperator: (
      state: ConnectedAccountState,
      action: PayloadAction<{
        appName: StakingAppName
        operator: string
      }>
    ) => {
      const { appName, operator } = action.payload
      state.operatorMapping.data.mappedOperators[appName] = operator
    },
    setFetchingOperatorMapping: (
      state: ConnectedAccountState,
      action: PayloadAction<{ isFetching: boolean }>
    ) => {
      const { isFetching } = action.payload
      state.operatorMapping.isFetching = isFetching
    },
    operatorMappingInitialFetchDone: (
      state: ConnectedAccountState,
      action: PayloadAction
    ) => {
      state.operatorMapping.isFetching = false
      state.operatorMapping.isInitialFetchDone = true
    },
    setOperatorMappingError: (
      state: ConnectedAccountState,
      action: PayloadAction<{ error: string }>
    ) => {
      const { error } = action.payload
      state.operatorMapping.isFetching = false
      state.operatorMapping.error = error
    },
    operatorRegistered: (
      state: ConnectedAccountState,
      action: PayloadAction<{
        appName: StakingAppName
        operator: string
      }>
    ) => {
      const { appName, operator } = action.payload
      state.operatorMapping.data.mappedOperators[appName] = operator
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
          state.operatorMapping.data.isUsedAsStakingProvider = true
        }
      }
    )
  },
})

export const registerConnectedAccountListeners = () => {
  if (featureFlags.MULTI_APP_STAKING) {
    startAppListening({
      actionCreator: setStakes,
      effect: getStakingProviderOperatorInfo,
    })
  }
}
registerConnectedAccountListeners()

export const {
  setConnectedAccountAddress,
  accountUsedAsStakingProvider,
  setMappedOperator,
  setFetchingOperatorMapping,
  operatorMappingInitialFetchDone,
  setOperatorMappingError,
  operatorRegistered,
} = connectedAccountSlice.actions
