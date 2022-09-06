import {
  AppName,
  selectAppByStakingProvider,
  selectAppStateByAppName,
} from "../store/applications"
import { useAppSelector } from "./store"

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
