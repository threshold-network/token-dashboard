import { createSelector } from "@reduxjs/toolkit"
import { RootState } from ".."
import { ApplicationsState, ApplicationState, AppName } from "./slice"

export const selectAppState = (state: RootState) => state.applications

export const selectAppStateByAppName = createSelector(
  [selectAppState, (_: RootState, appName: AppName) => appName],
  (applicationState: ApplicationsState, appName: AppName) => {
    return applicationState[appName]
  }
)

export const selectAppByStakingProvider = createSelector(
  [
    (state: RootState, appName: AppName, stakingProvider: string) =>
      selectAppStateByAppName(state, appName),
    (_: RootState, appName: AppName, stakingProvider: string) =>
      stakingProvider,
  ],
  (appState: ApplicationState, stakingProvider: string) => {
    return appState.stakingProviders[stakingProvider]
  }
)
