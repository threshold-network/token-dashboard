import { threshold } from "./getThresholdLib"
import { StakingAppName } from "../store/staking-applications"

const stakingAppNameToAppLabel: Record<StakingAppName, string> = {
  tbtc: "tBTC",
  randomBeacon: "Random Beacon",
}

const stakingAppAddressToAppName: Record<string, StakingAppName> = {
  [threshold.multiAppStaking.ecdsa.address]: "tbtc",
  [threshold.multiAppStaking.randomBeacon.address]: "randomBeacon",
}

export const getStakingAppNameFromAppAddress = (stakingAppAddress: string) => {
  return stakingAppAddressToAppName[stakingAppAddress]
}

export const getStakingAppLabelFromAppName = (
  stakingAppName: StakingAppName
) => {
  return stakingAppNameToAppLabel[stakingAppName]
}

export const getStakingAppLabelFromAppAddress = (address: string) => {
  const appName = getStakingAppNameFromAppAddress(address)
  return getStakingAppLabelFromAppName(appName) || "App"
}
