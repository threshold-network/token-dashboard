import { Contract } from "ethers"
import { useThreshold } from "../contexts/ThresholdContext"
import {
  applicationsSlice,
  AppName,
  selectAppByStakingProvider,
  selectAppStateByAppName,
} from "../store/applications"
import { useSubscribeToContractEvent } from "../web3/hooks"
import { useAppDispatch, useAppSelector } from "./store"

export const useApplicationState = (appName: AppName) => {
  return useAppSelector((state) => selectAppStateByAppName(state, appName))
}

export const useAppParameters = (appName: AppName) => {
  return useApplicationState(appName).parameters
}

export const useAppMinAuthorizationAmount = (appName: AppName) => {
  return useAppParameters(appName).minimumAuthorization
}

export const useAppDataByStakingProvider = (
  appName: AppName,
  stakingProvider: string
) => {
  return useAppSelector((state) =>
    selectAppByStakingProvider(state, appName, stakingProvider)
  )
}

const appNameToAppService: Record<AppName, "ecdsa" | "randomBeacon"> = {
  tbtc: "ecdsa",
  randomBeacon: "randomBeacon",
}

const useStakingAppContract = (appName: AppName) => {
  return useThreshold().multiAppStaking[appNameToAppService[appName]].contract
}

export const useSubscribeToAuthorizationIncreasedEvent = (appName: AppName) => {
  const contract = useStakingAppContract(appName)
  const dispatch = useAppDispatch()

  useSubscribeToContractEvent(
    contract,
    "AuthorizationIncreased",
    // @ts-ignore
    async (stakingProvider, operator, fromAmount, toAmount) => {
      dispatch(
        applicationsSlice.actions.authorizationIncreased({
          stakingProvider,
          toAmount: toAmount.toString(),
          appName,
        })
      )
    }
  )
}
