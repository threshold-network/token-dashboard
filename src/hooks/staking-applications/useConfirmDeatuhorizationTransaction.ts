import { TransactionReceipt } from "@ethersproject/providers"
import { useThreshold } from "../../contexts/ThresholdContext"
import { StakingAppName } from "../../store/staking-applications"
import { useSendTransactionFromFn } from "../../web3/hooks"
import { stakingAppNameToThresholdAppService } from "./useStakingAppContract"

export const useConfirmDeatuhorizationTransaction = (
  appName: StakingAppName,
  onSuccess?: (tx: TransactionReceipt) => void | Promise<void>,
  onError?: (error: any) => void | Promise<void>
) => {
  const threshold = useThreshold()

  return useSendTransactionFromFn(
    threshold.multiAppStaking[stakingAppNameToThresholdAppService[appName]]
      .approveAuthorizationDecrease,
    onSuccess,
    onError
  )
}
