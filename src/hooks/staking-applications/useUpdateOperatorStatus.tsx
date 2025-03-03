import { useThreshold } from "../../contexts/ThresholdContext"
import { StakingAppName } from "../../store/staking-applications"
import { useSendTransactionFromFn } from "../../web3/hooks"
import { appNameToThresholdApp } from "./useStakingAppContract"

export const useUpdateOperatorStatus = (appName: StakingAppName) => {
  const threshold = useThreshold()

  return useSendTransactionFromFn(
    threshold.multiAppStaking[appNameToThresholdApp[appName]]
      ?.updateOperatorStatus!
  )
}
