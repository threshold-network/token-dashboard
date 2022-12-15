import {
  AnyAction,
  createSlice,
  isAnyOf,
  PayloadAction,
} from "@reduxjs/toolkit"
import { BigNumber } from "ethers"
import { featureFlags } from "../../constants"
import {
  StakingProviderAppInfo,
  AuthorizationParameters,
} from "../../threshold-ts/applications"
import { AddressZero, MAX_UINT64 } from "../../threshold-ts/utils"
import { FetchingState } from "../../types"
import { startAppListening } from "../listener"
import { providerStaked, setStakes } from "../staking"
import {
  getSupportedAppsStakingProvidersData,
  getSupportedAppsEffect,
  displayMapOperatorToStakingProviderModalEffect,
  shouldDisplayNewAppsToAuthorizeModal,
  displayNewAppsToAuthorizeModalEffect,
  displayDeauthrizationCompletedModalEffect,
  displayDeauthrizationInitiatedModalEffect,
} from "./effects"
import { setMappedOperators } from "../account"
import { dateToUnixTimestamp } from "../../utils/date"

type StakingApplicationDataByStakingProvider = {
  [stakingProvider: string]: StakingProviderAppInfo<string>
}

export type StakingApplicationState = {
  parameters: FetchingState<AuthorizationParameters<string>>
  stakingProviders: FetchingState<StakingApplicationDataByStakingProvider>
}

export interface StakingApplicationsState {
  tbtc: StakingApplicationState
  randomBeacon: StakingApplicationState
}

export type StakingAppName = "tbtc" | "randomBeacon"

export const stakingApplicationsSlice = createSlice({
  name: "staking-applications",
  initialState: {
    tbtc: {
      parameters: {
        isFetching: false,
        error: "",
        data: {
          authorizationDecreaseChangePeriod: "0",
          minimumAuthorization: "0",
          authorizationDecreaseDelay: "0",
        },
      },
      stakingProviders: {
        isFetching: false,
        error: "",
        data: {},
      },
    },
    randomBeacon: {
      parameters: {
        isFetching: false,
        error: "",
        data: {
          authorizationDecreaseChangePeriod: "0",
          minimumAuthorization: "0",
          authorizationDecreaseDelay: "0",
        },
      },
      stakingProviders: {
        isFetching: false,
        error: "",
        data: {},
      },
    },
  } as StakingApplicationsState,
  reducers: {
    getSupportedApps: (state: StakingApplicationsState, action) => {},
    setAppParameters: (
      state: StakingApplicationsState,
      action: PayloadAction<{
        appName: StakingAppName
        parameters: AuthorizationParameters<string>
      }>
    ) => {
      const { appName, parameters } = action.payload
      state[appName].parameters = {
        data: { ...parameters },
        isFetching: false,
        error: "",
      }
    },
    setAppParametersError: (
      state: StakingApplicationsState,
      action: PayloadAction<{ appName: StakingAppName; error: string }>
    ) => {
      const { appName, error } = action.payload
      state[appName].parameters.isFetching = false
      state[appName].parameters.error = error
    },
    fetchingAppParameters: (
      state: StakingApplicationsState,
      action: PayloadAction<{ appName: StakingAppName }>
    ) => {
      const { appName } = action.payload
      state[appName].parameters.isFetching = true
    },
    setStakingProvidersAppData: (
      state: StakingApplicationsState,
      action: PayloadAction<{
        appName: StakingAppName
        data: StakingApplicationDataByStakingProvider
      }>
    ) => {
      const { appName, data } = action.payload
      state[appName].stakingProviders = {
        isFetching: false,
        error: "",
        data,
      }
    },
    fetchingStakingProvidersAppData: (
      state: StakingApplicationsState,
      action: PayloadAction<{
        appName: StakingAppName
      }>
    ) => {
      const { appName } = action.payload
      state[appName].stakingProviders.isFetching = true
    },
    setStakingProvidersAppDataError: (
      state: StakingApplicationsState,
      action: PayloadAction<{
        appName: StakingAppName
        error: string
      }>
    ) => {
      const { appName, error } = action.payload
      state[appName].stakingProviders.isFetching = false
      state[appName].stakingProviders.error = error
    },
    authorizationIncreased: (
      state: StakingApplicationsState,
      action: PayloadAction<{
        stakingProvider: string
        toAmount: string
        appName: StakingAppName
      }>
    ) => {
      const { stakingProvider, toAmount, appName } = action.payload

      const stakingProviderData =
        state[appName]?.stakingProviders.data[stakingProvider]

      if (!stakingProviderData) return

      state[appName].stakingProviders.data[stakingProvider].authorizedStake =
        toAmount
    },
    authorizationDecreaseApproved: (
      state: StakingApplicationsState,
      action: PayloadAction<{
        stakingProvider: string
        appName: StakingAppName
        txHash: string
      }>
    ) => {
      const { stakingProvider, appName } = action.payload
      const stakingProviderData =
        state[appName].stakingProviders.data[stakingProvider]

      if (!stakingProviderData) return

      const authorizedStake = BigNumber.from(
        stakingProviderData.authorizedStake
      )
        .sub(stakingProviderData.pendingAuthorizationDecrease)
        .toString()

      state[appName].stakingProviders.data[stakingProvider] = {
        ...stakingProviderData,
        authorizedStake,
        pendingAuthorizationDecrease: "0",
        remainingAuthorizationDecreaseDelay: "0",
      }
    },
    authorizationDecreaseRequested: (
      state: StakingApplicationsState,
      action: PayloadAction<{
        stakingProvider: string
        appName: StakingAppName
        decreaseAmount: string
        decreasingAt: string
        txHash: string
      }>
    ) => {
      const { stakingProvider, appName, decreaseAmount, decreasingAt } =
        action.payload
      const stakingProviderData =
        state[appName].stakingProviders.data[stakingProvider]

      if (!stakingProviderData) return

      // There are only two possible scenarios:
      // 1. When the operator is not known- the application contract sets
      //    `decreasingAt` to current block timestamp. It means an authorizer
      //    can approve authorization decrease immediately because that operator
      //    was never in the sortition pool.
      // 2. When the operator is known- the application contract sets
      //    `decreasingAt` to `MAX_UINT64`.  It means that this operator is or
      //    was in the sortition pool. Before authorization decrease delay
      //    starts, the operator needs to update the state of the sortition pool
      //    with a call to `joinSortitionPool` or `updateOperatorStatus`.
      const isDeauthorizationReqestActive =
        !BigNumber.from(decreasingAt).eq(MAX_UINT64)

      state[appName].stakingProviders.data[stakingProvider] = {
        ...stakingProviderData,
        isDeauthorizationReqestActive,
        pendingAuthorizationDecrease: decreaseAmount,
        remainingAuthorizationDecreaseDelay: isDeauthorizationReqestActive
          ? "0"
          : MAX_UINT64.toString(),
        deauthorizationCreatedAt: undefined,
      }
    },
    operatorStatusUpdated: (
      state: StakingApplicationsState,
      action: PayloadAction<{
        stakingProvider: string
        appName: StakingAppName
        txHash: string
      }>
    ) => {
      const { stakingProvider, appName } = action.payload
      const stakingProviderData =
        state[appName].stakingProviders.data[stakingProvider]

      if (!stakingProviderData) return

      const deauthorizationCreatedAt =
        !stakingProviderData.isDeauthorizationReqestActive
          ? dateToUnixTimestamp().toString()
          : stakingProviderData.deauthorizationCreatedAt

      state[appName].stakingProviders.data[stakingProvider] = {
        ...stakingProviderData,
        remainingAuthorizationDecreaseDelay:
          state[appName].parameters.data.authorizationDecreaseDelay,
        isDeauthorizationReqestActive: true,
        deauthorizationCreatedAt,
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: AnyAction) => action.type.match(providerStaked),
      (state, action: ReturnType<typeof providerStaked>) => {
        const { stakingProvider } = action.payload

        const defaultAuthData: StakingProviderAppInfo<string> = {
          authorizedStake: "0",
          pendingAuthorizationDecrease: "0",
          remainingAuthorizationDecreaseDelay: "0",
          isDeauthorizationReqestActive: false,
          deauthorizationCreatedAt: undefined,
          isOperatorInPool: undefined,
          operator: AddressZero,
        }

        state.randomBeacon.stakingProviders.data[stakingProvider] = {
          ...defaultAuthData,
        }
        state.tbtc.stakingProviders.data[stakingProvider] = {
          ...defaultAuthData,
        }
      }
    )
  },
})

export const registerStakingAppsListeners = () => {
  if (featureFlags.MULTI_APP_STAKING) {
    startAppListening({
      actionCreator: stakingApplicationsSlice.actions.getSupportedApps,
      effect: getSupportedAppsEffect,
    })

    startAppListening({
      actionCreator: setStakes,
      effect: getSupportedAppsStakingProvidersData,
    })

    startAppListening({
      predicate: shouldDisplayNewAppsToAuthorizeModal,
      effect: displayNewAppsToAuthorizeModalEffect,
    })

    startAppListening({
      actionCreator:
        stakingApplicationsSlice.actions.authorizationDecreaseApproved,
      effect: displayDeauthrizationCompletedModalEffect,
    })

    startAppListening({
      // @ts-ignore
      matcher: isAnyOf(
        stakingApplicationsSlice.actions.authorizationDecreaseRequested,
        stakingApplicationsSlice.actions.operatorStatusUpdated
      ),
      // @ts-ignore
      effect: displayDeauthrizationInitiatedModalEffect,
    })

    startAppListening({
      actionCreator: setMappedOperators,
      effect: displayMapOperatorToStakingProviderModalEffect,
    })
  }
}

registerStakingAppsListeners()
