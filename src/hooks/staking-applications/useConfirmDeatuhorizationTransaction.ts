import { useThreshold } from "../../contexts/ThresholdContext"
import { StakingAppName } from "../../store/staking-applications"
import {
  OnErrorCallback,
  OnSuccessCallback,
  useSendTransactionFromFn,
} from "../../web3/hooks"
import { stakingAppNameToThresholdAppService } from "./useStakingAppContract"

export const useConfirmDeatuhorizationTransaction = (
  appName: StakingAppName,
  onSuccess?: OnSuccessCallback,
  onError?: OnErrorCallback
) => {
  const threshold = useThreshold()

  return useSendTransactionFromFn(
    threshold.multiAppStaking[stakingAppNameToThresholdAppService[appName]]
      .approveAuthorizationDecrease,
    onSuccess,
    onError
  )
}
