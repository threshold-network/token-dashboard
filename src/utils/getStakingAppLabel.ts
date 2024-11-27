import { useThreshold } from "../contexts/ThresholdContext"
import { StakingAppName } from "../store/staking-applications"

const stakingAppNameToAppLabel: Record<StakingAppName, string> = {
  tbtc: "tBTC",
  randomBeacon: "Random Beacon",
  taco: "TACo",
}

export const getStakingAppNameFromAppAddress = (stakingAppAddress: string) => {
  const threshold = useThreshold()

  if (
    !threshold.multiAppStaking.ecdsa ||
    !threshold.multiAppStaking.randomBeacon ||
    !threshold.multiAppStaking.taco
  ) {
    return null
  }

  const stakingAppAddressToAppName: Record<string, StakingAppName> = {
    [threshold.multiAppStaking.ecdsa.address]: "tbtc",
    [threshold.multiAppStaking.randomBeacon.address]: "randomBeacon",
    [threshold.multiAppStaking.taco.address]: "taco",
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
