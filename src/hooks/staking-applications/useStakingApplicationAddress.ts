import { useThreshold } from "../../contexts/ThresholdContext"
import { StakingAppName } from "../../store/staking-applications"
import { AddressZero } from "../../web3/utils"
import { appNameToThresholdApp } from "./useStakingAppContract"

export const useStakingApplicationAddress = (appName: StakingAppName) => {
  const threshold = useThreshold()

  return (
    threshold.multiAppStaking[appNameToThresholdApp[appName]]?.address ??
    AddressZero
  )
}
