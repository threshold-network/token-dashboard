import { threshold } from "./getThresholdLib"
import { StakingAppName } from "../store/staking-applications"

const stakingAppNameToAppLabel: Record<StakingAppName, string> = {
  tbtc: "tBTC",
  randomBeacon: "Random Beacon",
  taco: "TACo"
}

const stakingAppAddressToName: { [key: string]: string } = {
  [threshold.multiAppStaking.ecdsa.address]: stakingAppNameToAppLabel.tbtc,
  [threshold.multiAppStaking.randomBeacon.address]:
    stakingAppNameToAppLabel.randomBeacon,
  [threshold.multiAppStaking.taco.address]: stakingAppNameToAppLabel.taco
}

export const getStakingAppNameFromAddress = (stakingAppAddress: string) => {
  return stakingAppAddressToName[stakingAppAddress] ?? "App"
}

export const getSakingAppLabel = (stakingAppName: StakingAppName) => {
  return stakingAppNameToAppLabel[stakingAppName]
}
