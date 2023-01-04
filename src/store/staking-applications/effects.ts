import { AnyAction } from "@reduxjs/toolkit"
import { stakingApplicationsSlice, StakingAppName } from "./slice"
import { AppListenerEffectAPI } from "../listener"
import {
  selectStakeByStakingProvider,
  selectStakingProviders,
  setStakes,
} from "../staking"
import {
  mapOperatorToStakingProviderModalClosed,
  modalSlice,
  openModal,
} from "../modal"
import {
  IApplication,
  StakingProviderAppInfo,
} from "../../threshold-ts/applications"
import { ModalType } from "../../enums"
import { RootState } from ".."
import {
  selectStakingAppByStakingProvider,
  selectStakingAppStateByAppName,
} from "./selectors"
import { isAddressZero } from "../../web3/utils"
import { BigNumber } from "ethers"
import { MAX_UINT64 } from "../../threshold-ts/utils"

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
      listenerApi.extra.threshold.multiAppStaking.ecdsa,
      "tbtc",
      listenerApi
    )
    await getKeepStakingAppStakingProvidersData(
      stakingProviders,
      listenerApi.extra.threshold.multiAppStaking.randomBeacon,
      "randomBeacon",
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
          ..._appData,
          authorizedStake: _appData.authorizedStake.toString(),
          pendingAuthorizationDecrease:
            _appData.pendingAuthorizationDecrease.toString(),
          remainingAuthorizationDecreaseDelay:
            _appData.remainingAuthorizationDecreaseDelay.toString(),
          isDeauthorizationReqestActive: _appData.isDeauthorizationReqestActive,
          deauthorizationCreatedAt:
            _appData.deauthorizationCreatedAt?.toString(),
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

export const displayMapOperatorToStakingProviderModalEffect = async (
  action: AnyAction,
  listenerApi: AppListenerEffectAPI
) => {
  const {
    modal: { modalQueue },
  } = listenerApi.getState()
  const { account } = listenerApi.getState()
  if (!modalQueue.isSuccessfulLoginModalClosed) {
    await listenerApi.condition((action, currentState) => {
      return currentState.modal.modalQueue.isSuccessfulLoginModalClosed
    })
  }
  const { address } = account
  if (!address) return

  listenerApi.unsubscribe()
  try {
    const { isStakingProvider } = account

    const {
      tbtc: mappedOperatorTbtc,
      randomBeacon: mappedOperatorRandomBeacon,
    } = action.payload

    if (
      isStakingProvider &&
      (isAddressZero(mappedOperatorTbtc) ||
        isAddressZero(mappedOperatorRandomBeacon))
    ) {
      listenerApi.dispatch(
        openModal({
          modalType: ModalType.MapOperatorToStakingProvider,
          props: {
            address,
            mappedOperatorTbtc: mappedOperatorTbtc,
            mappedOperatorRandomBeacon: mappedOperatorRandomBeacon,
          },
        })
      )
    } else {
      listenerApi.dispatch(mapOperatorToStakingProviderModalClosed())
    }
  } catch (error) {
    console.log(
      "Could not fetch info about mapped operators for given staking provider:",
      error
    )
    listenerApi.subscribe()
  }
}

export const displayNewAppsToAuthorizeModalEffect = async (
  action: AnyAction,
  listenerApi: AppListenerEffectAPI
) => {
  listenerApi.unsubscribe()
  const hasAnyUnauthorizedStakes = Object.values(
    selectStakingAppStateByAppName(listenerApi.getState(), "tbtc")
      .stakingProviders.data
  )
    .concat(
      Object.values(
        selectStakingAppStateByAppName(listenerApi.getState(), "randomBeacon")
          .stakingProviders.data
      )
    )
    .some(
      (stakingProviderAppInfo) =>
        stakingProviderAppInfo.authorizedStake &&
        stakingProviderAppInfo.authorizedStake === "0"
    )

  if (hasAnyUnauthorizedStakes) {
    listenerApi.dispatch(openModal({ modalType: ModalType.NewAppsToAuthorize }))
  }
}

export const shouldDisplayNewAppsToAuthorizeModal = (
  action: AnyAction,
  currentState: RootState,
  previousState: RootState
) => {
  return (
    currentState.modal.modalQueue.isSuccessfulLoginModalClosed &&
    currentState.modal.modalQueue
      .isMappingOperatorToStakingProviderModalClosed &&
    Object.values(
      currentState.applications.randomBeacon.stakingProviders.data ?? {}
    ).length > 0 &&
    Object.values(currentState.applications.tbtc.stakingProviders.data ?? {})
      .length > 0
  )
}

export const displayDeauthrizationCompletedModalEffect = (
  action: ReturnType<
    typeof stakingApplicationsSlice.actions.authorizationDecreaseApproved
  >,
  listenerApi: AppListenerEffectAPI
) => {
  const { stakingProvider, appName, txHash } = action.payload

  const stake = selectStakeByStakingProvider(
    listenerApi.getOriginalState(),
    stakingProvider
  )
  if (!stake) return

  const stakingProviderAppData = selectStakingAppByStakingProvider(
    listenerApi.getOriginalState(),
    appName,
    stakingProvider
  )

  listenerApi.dispatch(
    modalSlice.actions.openModal({
      modalType: ModalType.DeauthorizationCompleted,
      props: {
        stakingProvider,
        txHash,
        decreaseAmount: stakingProviderAppData.pendingAuthorizationDecrease,
      },
    })
  )
}

export const displayDeauthrizationInitiatedModalEffect = (
  action: ReturnType<
    | typeof stakingApplicationsSlice.actions.authorizationDecreaseRequested
    | typeof stakingApplicationsSlice.actions.operatorStatusUpdated
  >,
  listenerApi: AppListenerEffectAPI
) => {
  const { stakingProvider, txHash, appName } = action.payload

  const stake = selectStakeByStakingProvider(
    listenerApi.getOriginalState(),
    stakingProvider
  )
  if (!stake) return

  const appData = selectStakingAppByStakingProvider(
    listenerApi.getOriginalState(),
    appName,
    stakingProvider
  )

  const isAuthorizationDecreaseRequestedAction =
    stakingApplicationsSlice.actions.authorizationDecreaseRequested.match(
      action
    )

  const decreasingAt = isAuthorizationDecreaseRequestedAction
    ? action.payload.decreasingAt
    : undefined

  if (
    isAuthorizationDecreaseRequestedAction &&
    !appData.isOperatorInPool &&
    decreasingAt &&
    BigNumber.from(decreasingAt).eq(MAX_UINT64)
  ) {
    return
  }

  const decreaseAmount = isAuthorizationDecreaseRequestedAction
    ? action.payload.decreaseAmount
    : appData.pendingAuthorizationDecrease

  listenerApi.dispatch(
    modalSlice.actions.openModal({
      modalType: ModalType.DeauthorizationInitiated,
      props: {
        stakingProvider,
        txHash,
        decreaseAmount,
      },
    })
  )
}
