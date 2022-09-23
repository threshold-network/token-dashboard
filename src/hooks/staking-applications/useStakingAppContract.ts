import { StakingAppName } from "../../store/staking-applications"
import { useThreshold } from "../../contexts/ThresholdContext"

export const stakingAppNameToThresholdAppService: Record<
  StakingAppName,
  "ecdsa" | "randomBeacon"
> = {
  tbtc: "ecdsa",
  randomBeacon: "randomBeacon",
}

export const useStakingAppContract = (appName: StakingAppName) => {
  return useThreshold().multiAppStaking[
    stakingAppNameToThresholdAppService[appName]
  ].contract
}
