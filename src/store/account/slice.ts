import { AddressZero } from "@ethersproject/constants"
import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { featureFlags } from "../../constants"
import { FetchingState, TrmState } from "../../types"
import { isSameETHAddress } from "../../web3/utils"
import { startAppListening } from "../listener"
import {
  providerStaked,
  providerStakedForStakingProvider,
  setStakes,
} from "../staking"
import { StakingAppName } from "../staking-applications"
import { getStakingProviderOperatorInfo, getTrmInfo } from "./effects"

export interface AccountState {
  address: string
  chainId: number | undefined
  isStakingProvider: boolean
  operatorMapping: FetchingState<Record<StakingAppName, string>>
  trm: TrmState
}

export const accountSlice = createSlice({
  name: "account",
  initialState: {
    address: "",
    chainId: undefined,
    isStakingProvider: false,
    operatorMapping: {
      data: {
        tbtc: AddressZero,
        randomBeacon: AddressZero,
        taco: AddressZero,
      },
      isFetching: false,
      isInitialFetchDone: false,
    },
    trm: {
      isBlocked: false,
      isFetching: false,
      hasFetched: false,
    },
  } as AccountState,
  reducers: {
    walletConnected: (
      state: AccountState,
      action: PayloadAction<{
        address: string
        chainId: number | undefined
      }>
    ) => {
      const { address, chainId } = action.payload
      state.address = address
      state.chainId = chainId
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
        taco: string
      }>
    ) => {
      const { tbtc, randomBeacon, taco } = action.payload
      state.operatorMapping.data.tbtc = tbtc
      state.operatorMapping.data.randomBeacon = randomBeacon
      state.operatorMapping.data.taco = taco
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
    setTrm: (
      state: AccountState,
      action: PayloadAction<{ isBlocked: boolean }>
    ) => {
      const { isBlocked } = action.payload
      state.trm.isBlocked = isBlocked
      state.trm.hasFetched = true
      state.trm.isFetching = false
      state.trm.error = ""
    },
    fetchingTrm: (state: AccountState) => {
      state.trm.isFetching = true
    },
    setTrmError: (
      state: AccountState,
      action: PayloadAction<{ error: string }>
    ) => {
      const { error } = action.payload
      state.operatorMapping.isFetching = false
      state.trm.error = error
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

  if (featureFlags.TRM) {
    startAppListening({
      actionCreator: accountSlice.actions.walletConnected,
      effect: getTrmInfo,
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
  fetchingTrm,
  setTrm,
} = accountSlice.actions
