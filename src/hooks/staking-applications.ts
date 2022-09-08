import { useThreshold } from "../contexts/ThresholdContext"
import {
  stakingApplicationsSlice,
  StakingAppName,
  selectStakingAppByStakingProvider,
  selectStakingAppStateByAppName,
} from "../store/staking-applications"
import { useSubscribeToContractEvent } from "../web3/hooks"
import { useAppDispatch, useAppSelector } from "./store"

export const useStakingApplicationState = (appName: StakingAppName) => {
  return useAppSelector((state) =>
    selectStakingAppStateByAppName(state, appName)
  )
}

export const useStakingAppParameters = (appName: StakingAppName) => {
  return useStakingApplicationState(appName).parameters
}

export const useStakingAppMinAuthorizationAmount = (
  appName: StakingAppName
) => {
  return useStakingAppParameters(appName).minimumAuthorization
}

export const useStakingAppDataByStakingProvider = (
  appName: StakingAppName,
  stakingProvider: string
) => {
  return useAppSelector((state) =>
    selectStakingAppByStakingProvider(state, appName, stakingProvider)
  )
}

const appNameToAppService: Record<StakingAppName, "ecdsa" | "randomBeacon"> = {
  tbtc: "ecdsa",
  randomBeacon: "randomBeacon",
}

const useStakingAppContract = (appName: StakingAppName) => {
  return useThreshold().multiAppStaking[appNameToAppService[appName]].contract
}

export const useSubscribeToAuthorizationIncreasedEvent = (
  appName: StakingAppName
) => {
  const contract = useStakingAppContract(appName)
  const dispatch = useAppDispatch()

  useSubscribeToContractEvent(
    contract,
    "AuthorizationIncreased",
    // @ts-ignore
    async (stakingProvider, operator, fromAmount, toAmount) => {
      dispatch(
        stakingApplicationsSlice.actions.authorizationIncreased({
          stakingProvider,
          toAmount: toAmount.toString(),
          appName,
        })
      )
    }
  )
}
