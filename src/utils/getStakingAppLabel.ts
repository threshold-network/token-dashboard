import { threshold } from "./getThresholdLib"
import { StakingAppName } from "../store/staking-applications"

const stakingAppNameToAppLabel: Record<StakingAppName, string> = {
  tbtc: "tBTC",
  randomBeacon: "Random Beacon",
}

const stakingAppAddressToName: { [key: string]: string } = {
  [threshold.multiAppStaking.ecdsa.address]: stakingAppNameToAppLabel.tbtc,
  [threshold.multiAppStaking.randomBeacon.address]:
    stakingAppNameToAppLabel.randomBeacon,
}

export const getStakingAppNameFromAddress = (stakingAppAddress: string) => {
  return stakingAppAddressToName[stakingAppAddress] ?? "App"
}

export const getSakingAppLabel = (stakingAppName: StakingAppName) => {
  return stakingAppNameToAppLabel[stakingAppName]
}
