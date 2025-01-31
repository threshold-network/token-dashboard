import { StakingAppName } from "../../store/staking-applications"
import { useThreshold } from "../../contexts/ThresholdContext"
import { Contract } from "ethers"

export const appNameToThresholdApp: Record<
  StakingAppName,
  "ecdsa" | "randomBeacon" | "taco"
> = {
  tbtc: "ecdsa",
  randomBeacon: "randomBeacon",
  taco: "taco",
}

export const useStakingAppContract = (appName: StakingAppName): Contract => {
  const threshold = useThreshold()

  return threshold.multiAppStaking[appNameToThresholdApp[appName]]?.contract!
}
