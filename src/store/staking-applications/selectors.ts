import { createSelector } from "@reduxjs/toolkit"
import { RootState } from ".."
import {
  StakingApplicationsState,
  StakingApplicationState,
  StakingAppName,
} from "./slice"
import { selectStakeByStakingProvider } from "../staking"
import { AuthorizationStatus, StakeData } from "../../types"
import { calculatePercenteage } from "../../utils/percentage"
import { BigNumber } from "ethers"
import { Zero } from "@ethersproject/constants"

export const selectStakingAppState = (state: RootState) => state.applications

export const selectStakingAppStateByAppName = createSelector(
  [selectStakingAppState, (_: RootState, appName: StakingAppName) => appName],
  (applicationState: StakingApplicationsState, appName: StakingAppName) => {
    return applicationState[appName]
  }
)

export const selectStakingAppByStakingProvider = createSelector(
  [
    (state: RootState, appName: StakingAppName, stakingProvider: string) =>
      selectStakingAppStateByAppName(state, appName),
    (_: RootState, appName: StakingAppName, stakingProvider: string) =>
      stakingProvider,
    (state: RootState, appName: StakingAppName, stakingProvider: string) =>
      selectStakeByStakingProvider(state, stakingProvider),
  ],
  (
    appState: StakingApplicationState,
    stakingProvider: string,
    stake: StakeData | undefined
  ) => {
    const authData = appState.stakingProviders.data[stakingProvider] || {}
    const minAuth = appState.parameters.data.minimumAuthorization

    const isAuthorized = BigNumber.from(authData?.authorizedStake || "0").gte(
      BigNumber.from(minAuth || 0)
    )

    const hasPendingDeauthorization = Boolean(
      authData.pendingAuthorizationDecrease &&
        BigNumber.from(authData.pendingAuthorizationDecrease).gt(Zero)
    )

    let status: AuthorizationStatus = "to-authorize"
    if (isAuthorized && !hasPendingDeauthorization) {
      status = "authorized"
    } else if (
      hasPendingDeauthorization &&
      !authData?.isDeauthorizationReqestActive &&
      authData.isOperatorInPool !== undefined &&
      !authData.isOperatorInPool
    ) {
      status = "deauthorization-initiation-needed"
    } else if (hasPendingDeauthorization) {
      status = "pending-deauthorization"
    }

    return {
      ...authData,
      isAuthorized,
      percentage: calculatePercenteage(
        authData?.authorizedStake,
        stake?.totalInTStake
      ),
      hasPendingDeauthorization,
      status,
    }
  }
)
