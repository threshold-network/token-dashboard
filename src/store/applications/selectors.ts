import { createSelector } from "@reduxjs/toolkit"
import { RootState } from ".."
import { ApplicationsState, ApplicationState, AppName } from "./slice"
import { selectStakeByStakingProvider } from "../staking"
import { StakeData } from "../../types"
import { calculatePercenteage } from "../../utils/percentage"
import { BigNumber } from "ethers"

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
    (state: RootState, appName: AppName, stakingProvider: string) =>
      selectStakeByStakingProvider(state, stakingProvider),
  ],
  (
    appState: ApplicationState,
    stakingProvider: string,
    stake: StakeData | undefined
  ) => {
    const authData = appState.stakingProviders[stakingProvider] || {}
    const minAuth = appState.parameters.minimumAuthorization
    return {
      ...authData,
      isAuthorized: BigNumber.from(authData?.authorizedStake || "0").gte(
        BigNumber.from(minAuth || 0)
      ),
      percentage: calculatePercenteage(
        authData?.authorizedStake,
        stake?.totalInTStake
      ),
    }
  }
)
