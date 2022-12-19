import { AnyAction } from "@reduxjs/toolkit"
import {
  AllStakinApps,
  AuthorizationNotRequiredApps,
  stakingApplicationsSlice,
  StakingAppName,
} from "./slice"
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
import {
  IPRE,
  StakingProviderInfo as PREStakingProviderInfo,
} from "../../threshold-ts/applications/pre"
import { BigNumber, BigNumberish } from "ethers"

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

    await getPREAppStakingProvidersData(
      stakingProviders,
      listenerApi.extra.threshold.multiAppStaking.pre,
      "pre",
      listenerApi
    )
  } catch (error) {
    console.log("Could not fetch apps data for staking providers ", error)
    listenerApi.subscribe()
  }
}

const getStakingAppStakingProivdersData = async <DataType, MappedDataType>(
  stakingProviders: string[],
  application: IPRE | IApplication,
  appName: AllStakinApps,
  listenerApi: AppListenerEffectAPI,
  mapResultTo: (data: DataType) => MappedDataType,
  dispatchFn: (data: { [stakingProvider: string]: MappedDataType }) => AnyAction
) => {
  try {
    listenerApi.dispatch(
      stakingApplicationsSlice.actions.fetchingStakingProvidersAppData({
        appName,
      })
    )

    const appData: DataType[] = await Promise.all(
      stakingProviders.map(
        (stakingProvider) =>
          application.getStakingProviderAppInfo(
            stakingProvider
          ) as unknown as Promise<DataType>
      )
    )

    const appDataByStakingProvider = stakingProviders.reduce(
      (reducer, stakingProvider, index) => {
        const _appData = appData[index]
        reducer[stakingProvider] = mapResultTo(_appData)

        return reducer
      },
      {} as { [stakingProvider: string]: MappedDataType }
    )

    listenerApi.dispatch(dispatchFn(appDataByStakingProvider))
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

const getKeepStakingAppStakingProvidersData = async (
  stakingProviders: string[],
  application: IApplication,
  appName: StakingAppName,
  listenerApi: AppListenerEffectAPI
) => {
  type MappedDataType = StakingProviderAppInfo<string>
  const mapToResult = (data: StakingProviderAppInfo): MappedDataType => {
    return {
      authorizedStake: data.authorizedStake.toString(),
      pendingAuthorizationDecrease:
        data.pendingAuthorizationDecrease.toString(),
      remainingAuthorizationDecreaseDelay:
        data.remainingAuthorizationDecreaseDelay.toString(),
      isDeauthorizationReqestActive: data.isDeauthorizationReqestActive,
      deauthorizationCreatedAt: data.deauthorizationCreatedAt?.toString(),
    }
  }

  await getStakingAppStakingProivdersData<
    StakingProviderAppInfo,
    MappedDataType
  >(stakingProviders, application, appName, listenerApi, mapToResult, (data) =>
    stakingApplicationsSlice.actions.setStakingProvidersAppData({
      appName,
      data,
    })
  )
}

const getPREAppStakingProvidersData = async (
  stakingProviders: string[],
  application: IPRE,
  appName: AuthorizationNotRequiredApps,
  listenerApi: AppListenerEffectAPI
) => {
  type MappedDataType = PREStakingProviderInfo
  const mapToResult = (data: PREStakingProviderInfo): MappedDataType => data

  await getStakingAppStakingProivdersData<
    PREStakingProviderInfo,
    MappedDataType
  >(stakingProviders, application, appName, listenerApi, mapToResult, (data) =>
    stakingApplicationsSlice.actions.setStakingProvidersAppData({
      appName,
      data,
    })
  )
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
    typeof stakingApplicationsSlice.actions.authorizationDecreaseRequested
  >,
  listenerApi: AppListenerEffectAPI
) => {
  const { stakingProvider, txHash, decreaseAmount } = action.payload

  const stake = selectStakeByStakingProvider(
    listenerApi.getOriginalState(),
    stakingProvider
  )
  if (!stake) return

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
