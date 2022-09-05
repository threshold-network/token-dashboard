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

type ApplicationDataByStakingProvider = {
  [stakingProvider: string]: StakingProviderAppInfo<string>
}

interface ApplicationsState {
  tbtc: {
    parameters: AuthorizationParameters<string> & FetchingState
    stakingProviders: ApplicationDataByStakingProvider & FetchingState
  }
  randomBeacon: {
    parameters: AuthorizationParameters<string> & FetchingState
    stakingProviders: ApplicationDataByStakingProvider & FetchingState
  }
}

export type AppName = "tbtc" | "randomBeacon"

export const applicationsSlice = createSlice({
  name: "applications",
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
  } as ApplicationsState,
  reducers: {
    getSupportedApps: (state: ApplicationsState, action) => {},
    setAppParameters: (
      state: ApplicationsState,
      action: PayloadAction<{
        appName: AppName
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
      state: ApplicationsState,
      action: PayloadAction<{ appName: AppName; error: string }>
    ) => {
      const { appName, error } = action.payload
      state[appName].parameters.isFetching = false
      state[appName].parameters.error = error
    },
    fetchingAppParameters: (
      state: ApplicationsState,
      action: PayloadAction<{ appName: AppName }>
    ) => {
      const { appName } = action.payload
      state[appName].parameters.isFetching = true
    },
    // getStakingProvidersAppData: (
    //   state: ApplicationsState,
    //   action: PayloadAction<{ appName: AppName }>
    // ) => {},
    setStakingProvidersAppData: (
      state: ApplicationsState,
      action: PayloadAction<{
        appName: AppName
        data: ApplicationDataByStakingProvider
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
      state: ApplicationsState,
      action: PayloadAction<{
        appName: AppName
      }>
    ) => {
      const { appName } = action.payload
      state[appName].stakingProviders.isFetching = true
    },
    setStakingProvidersAppDataError: (
      state: ApplicationsState,
      action: PayloadAction<{
        appName: AppName
        error: string
      }>
    ) => {
      const { appName, error } = action.payload
      state[appName].stakingProviders.isFetching = false
      state[appName].stakingProviders.error = error
    },
  },
})

startAppListening({
  actionCreator: applicationsSlice.actions.getSupportedApps,
  effect: getSupportedAppsEffect,
})

startAppListening({
  actionCreator: setStakes,
  effect: getSupportedAppsStakingProvidersData,
})
