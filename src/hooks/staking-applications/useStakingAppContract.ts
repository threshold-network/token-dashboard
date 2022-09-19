import { StakingAppName } from "../../store/staking-applications"
import { useThreshold } from "../../contexts/ThresholdContext"

const appNameToAppService: Record<StakingAppName, "ecdsa" | "randomBeacon"> = {
  tbtc: "ecdsa",
  randomBeacon: "randomBeacon",
}

export const useStakingAppContract = (appName: StakingAppName) => {
  return useThreshold().multiAppStaking[appNameToAppService[appName]].contract
}
