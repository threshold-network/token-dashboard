import { useThreshold } from "../../contexts/ThresholdContext"
import { StakingAppName } from "../../store/staking-applications"
import { Application } from "../../threshold-ts/applications"
import {
  OnErrorCallback,
  OnSuccessCallback,
  useSendTransactionFromFn,
} from "../../web3/hooks"
import { appNameToThresholdApp } from "./useStakingAppContract"

export const useBondOperatorTransaction = (
  appName: StakingAppName,
  onSuccess?: OnSuccessCallback,
  onError?: OnErrorCallback
) => {
  const threshold = useThreshold()

  return useSendTransactionFromFn(
    (threshold.multiAppStaking[appNameToThresholdApp[appName]] as Application)
      ?.bondOperator,
    onSuccess,
    onError
  )
}
