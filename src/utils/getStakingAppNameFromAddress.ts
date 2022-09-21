import { threshold } from "./getThresholdLib"

const stakingAppAddressToName: { [key: string]: string } = {
  [threshold.multiAppStaking.ecdsa.address]: "TBTC",
  [threshold.multiAppStaking.randomBeacon.address]: "Random Beacon",
}

export const getStakingAppNameFromAddress = (stakingAppAddress: string) => {
  return stakingAppAddressToName[stakingAppAddress] ?? "App"
}
