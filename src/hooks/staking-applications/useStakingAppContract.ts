import { StakingAppName } from "../../store/staking-applications"
import { useThreshold } from "../../contexts/ThresholdContext"
import { Contract } from "ethers"

export const stakingAppNameToThresholdAppService: Record<
  StakingAppName,
  "ecdsa" | "randomBeacon" | "taco"
> = {
  tbtc: "ecdsa",
  randomBeacon: "randomBeacon",
  taco: "taco",
}

export const useStakingAppContract = (
  appName: StakingAppName
): Contract | null => {
  const threshold = useThreshold()

  if (!threshold.multiAppStaking) return null

  return threshold.multiAppStaking[stakingAppNameToThresholdAppService[appName]]
    .contract
}
