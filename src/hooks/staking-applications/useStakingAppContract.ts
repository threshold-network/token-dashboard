import { StakingAppName } from "../../store/staking-applications"
import { useThreshold } from "../../contexts/ThresholdContext"

export const stakingAppNameToThresholdAppService: Record<
  StakingAppName,
  "ecdsa" | "randomBeacon" | "taco"
> = {
  tbtc: "ecdsa",
  randomBeacon: "randomBeacon",
  taco: "taco",
}

export const useStakingAppContract = (appName: StakingAppName) => {
  return useThreshold().multiAppStaking[
    stakingAppNameToThresholdAppService[appName]
  ].contract
}
