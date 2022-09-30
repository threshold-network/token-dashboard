import { AnyAction } from "@reduxjs/toolkit"
import { stakingApplicationsSlice, StakingAppName } from "./slice"
import { AppListenerEffectAPI } from "../listener"
import {
  selectStakeByStakingProvider,
  selectStakingProviders,
  setStakes,
} from "../staking"
import { modalSlice, openModal } from "../modal"
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
import { isAddressZero, isSameETHAddress } from "../../web3/utils"
import { mapOperatorToStakingProviderModalClosed } from "../modalQueue"

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
  const result = await listenerApi.condition((action, currentState: any) => {
    return currentState.modalQueue.isSuccessfullLoginModalClosed
  })
  const { connectedAccount, staking } = listenerApi.getState()
  const { address } = connectedAccount
  if (address) {
    listenerApi.unsubscribe()

    try {
      const { stakes } = staking
      let stakingProvider

      const stake = stakes.find((stake) =>
        isSameETHAddress(stake.stakingProvider, address)
      )

      if (stake) {
        stakingProvider = stake.stakingProvider
      } else {
        const { owner, authorizer, beneficiary } =
          await listenerApi.extra.threshold.staking.rolesOf(address)

        if (
          !isAddressZero(owner) &&
          !isAddressZero(authorizer) &&
          !isAddressZero(beneficiary)
        ) {
          stakingProvider = address
        }
      }

      if (stakingProvider) {
        const mappedOperators =
          await listenerApi.extra.threshold.multiAppStaking.getMappedOperatorsForStakingProvider(
            address
          )

        if (
          isAddressZero(mappedOperators.tbtc) ||
          isAddressZero(mappedOperators.randomBeacon)
        ) {
          listenerApi.dispatch(
            openModal({
              modalType: ModalType.MapOperatorToStakingProvider,
              props: {
                stakingProvider,
                mappedOperatorTbtc: mappedOperators.tbtc,
                mappedOperatorRandomBeacon: mappedOperators.randomBeacon,
              },
            })
          )
        } else {
          listenerApi.dispatch(mapOperatorToStakingProviderModalClosed())
        }
      }
    } catch (error) {
      console.log(
        "Could not fetch info about mapped operators for given staking provider:",
        error
      )
      listenerApi.subscribe()
    }
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
    currentState.modalQueue.isSuccessfullLoginModalClosed &&
    currentState.modalQueue.isMappingOperatorToStakingProviderModalClosed &&
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
