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

export interface AccountState {
  address: string
  isStakingProvider: boolean
  operatorMapping: FetchingState<Record<StakingAppName, string>>
}

export const accountSlice = createSlice({
  name: "account",
  initialState: {
    address: "",
    isStakingProvider: false,
    operatorMapping: {
      data: {
        tbtc: AddressZero,
        randomBeacon: AddressZero,
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
      state.isStakingProvider = true
    },
    setMappedOperators: (
      state: AccountState,
      action: PayloadAction<{
        tbtc: string
        randomBeacon: string
      }>
    ) => {
      const { tbtc, randomBeacon } = action.payload
      state.operatorMapping.data.tbtc = tbtc
      state.operatorMapping.data.randomBeacon = randomBeacon
      state.operatorMapping.isFetching = false
      state.operatorMapping.isInitialFetchDone = true
      state.operatorMapping.error = ""
    },
    fetchingOperatorMapping: (state: AccountState) => {
      state.operatorMapping.isFetching = true
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
      state.operatorMapping.data[appName] = operator
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
          state.isStakingProvider = true
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
  setMappedOperators,
  fetchingOperatorMapping,
  setOperatorMappingError,
  operatorRegistered,
} = accountSlice.actions
