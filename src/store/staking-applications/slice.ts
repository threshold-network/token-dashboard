import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import {
  StakingProviderAppInfo,
  AuthorizationParameters,
} from "../../threshold-ts/applications"
import { FetchingState } from "../../types"
import { startAppListening } from "../listener"
import { setStakes } from "../staking"
import {
  getSupportedAppsStakingProvidersData,
  getSupportedAppsEffect,
} from "./effects"

type StakingApplicationDataByStakingProvider = {
  [stakingProvider: string]: StakingProviderAppInfo<string>
}

export type StakingApplicationState = {
  parameters: AuthorizationParameters<string> & FetchingState
  stakingProviders: StakingApplicationDataByStakingProvider & FetchingState
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
        authorizationDecreaseChangePeriod: "0",
        minimumAuthorization: "0",
        authorizationDecreaseDelay: "0",
      },
      stakingProviders: {
        isFetching: false,
        error: "",
      },
    },
    randomBeacon: {
      parameters: {
        isFetching: false,
        error: "",
        authorizationDecreaseChangePeriod: "0",
        minimumAuthorization: "0",
        authorizationDecreaseDelay: "0",
      },
      stakingProviders: {
        isFetching: false,
        error: "",
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
        ...parameters,
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
      // @ts-ignore
      state[appName].stakingProviders = {
        isFetching: false,
        error: "",
        ...data,
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
      if (state[appName].stakingProviders) {
        state[appName].stakingProviders[stakingProvider].authorizedStake =
          toAmount
      }
    },
  },
})

startAppListening({
  actionCreator: stakingApplicationsSlice.actions.getSupportedApps,
  effect: getSupportedAppsEffect,
})

startAppListening({
  actionCreator: setStakes,
  effect: getSupportedAppsStakingProvidersData,
})
