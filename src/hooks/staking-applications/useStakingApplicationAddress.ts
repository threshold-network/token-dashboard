import { useThreshold } from "../../contexts/ThresholdContext"
import { StakingAppName } from "../../store/staking-applications"
import { AddressZero } from "../../web3/utils"
import { stakingAppNameToThresholdAppService } from "./useStakingAppContract"

export const useStakingApplicationAddress = (appName: StakingAppName) => {
  return (
    useThreshold().multiAppStaking[stakingAppNameToThresholdAppService[appName]]
      ?.address ?? AddressZero
  )
}
