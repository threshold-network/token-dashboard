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
import {
  getBlocklistInfo,
  getStakingProviderOperatorInfo,
  getTrmInfo,
  getBtcAddressTrmInfo,
} from "./effects"

export interface AccountState {
  address: string
  chainId: number | undefined
  isStakingProvider: boolean
  isBlocked: boolean
  operatorMapping: FetchingState<Record<StakingAppName, string>>
  trm: TrmState
}

export const accountSlice = createSlice({
  name: "account",
  initialState: {
    address: "",
    chainId: undefined,
    isStakingProvider: false,
    isBlocked: false,
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
    bitcoinAddressSubmitted: (
      state: AccountState,
      action: PayloadAction<{ btcAddress: string; ethChainId?: number }>
    ) => {
      // This action primarily triggers an effect. State changes related to TRM
      // (like isFetching, error, isBlocked) are handled by other reducers
      // dispatched from the effect (fetchingTrm, setAccountBlockedStatus, etc.).
      // We could add a specific state here if needed, e.g., state.trm.lastCheckedBtcAddress = action.payload.btcAddress
    },
    accountUsedAsStakingProvider: (
      state: AccountState,
      action: PayloadAction
    ) => {
      state.isStakingProvider = true
    },
    setAccountBlockedStatus: (
      state: AccountState,
      action: PayloadAction<{ isBlocked: boolean }>
    ) => {
      const { isBlocked } = action.payload
      state.isBlocked = isBlocked
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
    hasFetchedTrm: (state: AccountState) => {
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
      state.trm.isFetching = false
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
  startAppListening({
    actionCreator: accountSlice.actions.walletConnected,
    effect: getBlocklistInfo,
  })

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
    startAppListening({
      actionCreator: accountSlice.actions.bitcoinAddressSubmitted,
      effect: getBtcAddressTrmInfo,
    })
  }
}
registerAccountListeners()

export const {
  walletConnected,
  bitcoinAddressSubmitted,
  accountUsedAsStakingProvider,
  setAccountBlockedStatus,
  setMappedOperators,
  fetchingOperatorMapping,
  setOperatorMappingError,
  operatorRegistered,
  fetchingTrm,
  hasFetchedTrm,
} = accountSlice.actions
