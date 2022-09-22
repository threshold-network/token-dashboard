import { stakingApplicationsSlice, StakingAppName } from "./slice"
import { AppListenerEffectAPI } from "../listener"
import { selectStakingProviders, setStakes } from "../staking"
import {
  IApplication,
  StakingProviderAppInfo,
} from "../../threshold-ts/applications"
import { AnyAction } from "@reduxjs/toolkit"
import { RootState } from ".."
import { isAddressZero } from "../../web3/utils"
import { openModal } from "../modal"
import { ModalType } from "../../enums"
import { featureFlags } from "../../constants"

export const getSupportedAppsEffect = async (
  action: ReturnType<typeof stakingApplicationsSlice.actions.getSupportedApps>,
  listenerApi: AppListenerEffectAPI
) => {
  try {
    listenerApi.unsubscribe()
    listenerApi.dispatch(
      stakingApplicationsSlice.actions.fetchingAppParameters({
        appName: "tbtc",
      })
    )
    listenerApi.dispatch(
      stakingApplicationsSlice.actions.fetchingAppParameters({
        appName: "randomBeacon",
      })
    )
    const data =
      await listenerApi.extra.threshold.multiAppStaking.getSupportedAppsAuthParameters()
    // one-off listener
    const payload = {
      tbtc: {
        minimumAuthorization: data.tbtc.minimumAuthorization.toString(),

        authorizationDecreaseDelay:
          data.tbtc.authorizationDecreaseDelay.toString(),

        authorizationDecreaseChangePeriod:
          data.tbtc.authorizationDecreaseChangePeriod.toString(),
      },
      randomBeacon: {
        minimumAuthorization: data.randomBeacon.minimumAuthorization.toString(),

        authorizationDecreaseDelay:
          data.randomBeacon.authorizationDecreaseDelay.toString(),

        authorizationDecreaseChangePeriod:
          data.randomBeacon.authorizationDecreaseChangePeriod.toString(),
      },
    }
    listenerApi.dispatch(
      stakingApplicationsSlice.actions.setAppParameters({
        appName: "randomBeacon",
        parameters: payload.randomBeacon,
      })
    )
    listenerApi.dispatch(
      stakingApplicationsSlice.actions.setAppParameters({
        appName: "tbtc",
        parameters: payload.tbtc,
      })
    )
  } catch (error) {
    const errorMessage = (error as Error).toString()
    listenerApi.dispatch(
      stakingApplicationsSlice.actions.setAppParametersError({
        appName: "randomBeacon",
        error: errorMessage,
      })
    )
    listenerApi.dispatch(
      stakingApplicationsSlice.actions.setAppParametersError({
        appName: "tbtc",
        error: errorMessage,
      })
    )
    console.log("Could not fetch supported apps auth parameters", error)
    listenerApi.subscribe()
  }
}

export const getSupportedAppsStakingProvidersData = async (
  action: ReturnType<typeof setStakes>,
  listenerApi: AppListenerEffectAPI
) => {
  try {
    const stakingProviders = selectStakingProviders(listenerApi.getState())
    if (stakingProviders.length === 0) return
    // one-off listener
    listenerApi.unsubscribe()

    await getKeepStakingAppStakingProvidersData(
      stakingProviders,
      listenerApi.extra.threshold.multiAppStaking.randomBeacon,
      "randomBeacon",
      listenerApi
    )

    await getKeepStakingAppStakingProvidersData(
      stakingProviders,
      listenerApi.extra.threshold.multiAppStaking.ecdsa,
      "tbtc",
      listenerApi
    )
  } catch (error) {
    console.log("Could not fetch apps data for staking providers ", error)
    listenerApi.subscribe()
  }
}

const getKeepStakingAppStakingProvidersData = async (
  stakingProviders: string[],
  application: IApplication,
  appName: StakingAppName,
  listenerApi: AppListenerEffectAPI
) => {
  try {
    listenerApi.dispatch(
      stakingApplicationsSlice.actions.fetchingStakingProvidersAppData({
        appName,
      })
    )
    const appData = await Promise.all(
      stakingProviders.map(application.getStakingProviderAppInfo)
    )
    const appDataByStakingProvider = stakingProviders.reduce(
      (reducer, stakingProvider, index) => {
        const _appData = appData[index]
        reducer[stakingProvider] = {
          authorizedStake: _appData.authorizedStake.toString(),
          pendingAuthorizationDecrease:
            _appData.pendingAuthorizationDecrease.toString(),
          remainingAuthorizationDecreaseDelay:
            _appData.remainingAuthorizationDecreaseDelay.toString(),
        }
        return reducer
      },
      {} as { [stakingProvider: string]: StakingProviderAppInfo<string> }
    )
    listenerApi.dispatch(
      stakingApplicationsSlice.actions.setStakingProvidersAppData({
        appName,
        data: appDataByStakingProvider,
      })
    )
  } catch (error) {
    listenerApi.dispatch(
      stakingApplicationsSlice.actions.setStakingProvidersAppDataError({
        appName,
        error: (error as Error).toString(),
      })
    )
    throw error
  }
}

export const getMappedOperatorsEffect = async (
  action: AnyAction,
  listenerApi: AppListenerEffectAPI
) => {
  try {
    const { connectedAccount } = listenerApi.getState()
    const { address } = connectedAccount

    if (address) {
      listenerApi.unsubscribe()
      getMappedOperatorEffect(address, "randomBeacon", listenerApi)
      getMappedOperatorEffect(address, "tbtc", listenerApi)
    }
  } catch (error) {
    console.log(
      "Could not fetch mapped operator for connected staking provider: ",
      error
    )
    listenerApi.subscribe()
  }
}

const getMappedOperatorEffect = async (
  stakingProvider: string,
  appName: StakingAppName,
  listenerApi: AppListenerEffectAPI
) => {
  try {
    listenerApi.dispatch(
      stakingApplicationsSlice.actions.fetchingMappedOperator({
        appName,
      })
    )
    const appNameProp = appName === "tbtc" ? "ecdsa" : appName
    if (stakingProvider) {
      const operatorMapped = await listenerApi.extra.threshold.multiAppStaking[
        appNameProp
      ].stakingProviderToOperator(stakingProvider)
      listenerApi.dispatch(
        stakingApplicationsSlice.actions.setMappedOperator({
          appName: appName,
          operator: operatorMapped,
        })
      )
      listenerApi.dispatch(
        stakingApplicationsSlice.actions.setMappedOperatorInitialFetch({
          appName: appName,
          value: true,
        })
      )
    }
  } catch (error) {
    listenerApi.dispatch(
      stakingApplicationsSlice.actions.setStakingProvidersAppDataError({
        appName,
        error: (error as Error).toString(),
      })
    )
    throw error
  }
}

export const displayMapOperatorToStakingProviderModalEffect = async (
  action: AnyAction,
  listenerApi: AppListenerEffectAPI
) => {
  const { connectedAccount } = listenerApi.getState()
  const { address } = connectedAccount
  if (address) {
    // check if the current connected address is used somewhere as a staking
    // provider
    const { owner, authorizer, beneficiary } =
      await listenerApi.extra.threshold.staking.rolesOf(address)

    if (
      !isAddressZero(owner) ||
      !isAddressZero(authorizer) ||
      !isAddressZero(beneficiary)
    ) {
      if (featureFlags.MULTI_APP_STAKING === true) {
        listenerApi.dispatch(
          openModal({ modalType: ModalType.MapOperatorToStakingProvider })
        )
      }
    }
  }
}

export const shouldDisplayMapOperatorToStakingProviderModal = (
  action: AnyAction,
  currentState: RootState,
  previousState: RootState
) => {
  // TODO: Fix this condition (doesn't work properly)
  return (
    previousState.connectedAccount.address !==
      currentState.connectedAccount.address &&
    (currentState.applications.randomBeacon.mappedOperator
      .isInitialFetchDone! as boolean) &&
    (currentState.applications.tbtc.mappedOperator
      .isInitialFetchDone as boolean)
  )
}
