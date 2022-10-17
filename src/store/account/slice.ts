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

interface AccountState {
  address: string
  operatorMapping: FetchingState<{
    isUsedAsStakingProvider: boolean
    mappedOperators: {
      tbtc: string
      randomBeacon: string
      pre: string
    }
  }>
}

export const accountSlice = createSlice({
  name: "account",
  initialState: {
    address: "",
    operatorMapping: {
      data: {
        isUsedAsStakingProvider: false,
        mappedOperators: {
          tbtc: AddressZero,
          randomBeacon: AddressZero,
          pre: AddressZero,
        },
      },
      isFetching: false,
      isInitialFetchDone: false,
    },
  } as AccountState,
  reducers: {
    walletConnected: (state: AccountState, action: PayloadAction<string>) => {
      state.address = action.payload
    },
    accountUsedAsStakingProvider: (
      state: AccountState,
      action: PayloadAction
    ) => {
      state.operatorMapping.data.isUsedAsStakingProvider = true
    },
    setMappedOperator: (
      state: AccountState,
      action: PayloadAction<{
        appName: StakingAppName | "pre"
        operator: string
      }>
    ) => {
      const { appName, operator } = action.payload
      state.operatorMapping.data.mappedOperators[appName] = operator
    },
    setFetchingOperatorMapping: (
      state: AccountState,
      action: PayloadAction<{ isFetching: boolean }>
    ) => {
      const { isFetching } = action.payload
      state.operatorMapping.isFetching = isFetching
    },
    operatorMappingInitialFetchDone: (
      state: AccountState,
      action: PayloadAction
    ) => {
      state.operatorMapping.isFetching = false
      state.operatorMapping.isInitialFetchDone = true
    },
    setOperatorMappingError: (
      state: AccountState,
      action: PayloadAction<{ error: string }>
    ) => {
      const { error } = action.payload
      state.operatorMapping.isFetching = false
      state.operatorMapping.error = error
    },
    operatorRegistered: (
      state: AccountState,
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
        const { stakingProvider } = action.payload

        const { address } = state

        if (isSameETHAddress(stakingProvider, address)) {
          state.operatorMapping.data.isUsedAsStakingProvider = true
        }
      }
    )
  },
})

export const registerAccountListeners = () => {
  if (featureFlags.MULTI_APP_STAKING) {
    startAppListening({
      actionCreator: setStakes,
      effect: getStakingProviderOperatorInfo,
    })
  }
}
registerAccountListeners()

export const {
  walletConnected,
  accountUsedAsStakingProvider,
  setMappedOperator,
  setFetchingOperatorMapping,
  operatorMappingInitialFetchDone,
  setOperatorMappingError,
  operatorRegistered,
} = accountSlice.actions
