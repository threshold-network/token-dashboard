import { useThreshold } from "../contexts/ThresholdContext"
import { StakingAppName } from "../store/staking-applications"

const stakingAppNameToAppLabel: Record<StakingAppName, string> = {
  tbtc: "tBTC",
  randomBeacon: "Random Beacon",
  taco: "TACo",
}

export const getStakingAppNameFromAppAddress = (stakingAppAddress: string) => {
  const { multiAppStaking } = useThreshold()

  if (!multiAppStaking) {
    return null
  }

  const stakingAppAddressToAppName: Record<string, StakingAppName> = {
    [multiAppStaking.ecdsa.address]: "tbtc",
    [multiAppStaking.randomBeacon.address]: "randomBeacon",
    [multiAppStaking.taco.address]: "taco",
  }

  return stakingAppAddressToAppName[stakingAppAddress]
}

export const getStakingAppLabelFromAppName = (
  stakingAppName: StakingAppName | null
) => {
  if (!stakingAppName) {
    return null
  }
  return stakingAppNameToAppLabel[stakingAppName]
}

export const getStakingAppLabelFromAppAddress = (address: string) => {
  const appName = getStakingAppNameFromAppAddress(address)
  return getStakingAppLabelFromAppName(appName) || "App"
}
