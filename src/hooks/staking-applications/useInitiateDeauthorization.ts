import { ContractTransaction } from "ethers"
import { useCallback } from "react"
import { useThreshold } from "../../contexts/ThresholdContext"
import { StakingAppName } from "../../store/staking-applications"
import { useSendTransactionFromFn } from "../../web3/hooks"
import { isAddressZero } from "../../web3/utils"
import { stakingAppNameToThresholdAppService } from "./useStakingAppContract"
import { useUpdateOperatorStatus } from "./useUpdateOperatorStatus"

export const useInitiateDeauthorization = (
  appName: StakingAppName,
  shouldUpdateOperatorStatusAfterInitiation?: boolean,
  onSuccess?: (tx: ContractTransaction) => void | Promise<void>,
  onError?: (error: any) => void | Promise<void>
) => {
  const threshold = useThreshold()
  const {
    sendTransaction: updateOperatorStatus,
    status: updateOperatorTxStatus,
  } = useUpdateOperatorStatus(appName)

  const {
    sendTransaction: requestAuthorizationDecrease,
    status: deauthorizationTxStatus,
  } = useSendTransactionFromFn(
    threshold.multiAppStaking[stakingAppNameToThresholdAppService[appName]]
      .requestAuthorizationDecrease,
    onSuccess,
    onError
  )

  const sendTransaction = useCallback(
    async (stakingProvider: string, amount: string, operator?: string) => {
      await requestAuthorizationDecrease(stakingProvider, amount)

      if (!shouldUpdateOperatorStatusAfterInitiation) return
      if (!operator || isAddressZero(operator))
        throw new Error("Operator address is required!")

      await updateOperatorStatus(operator)
    },
    [
      requestAuthorizationDecrease,
      updateOperatorStatus,
      shouldUpdateOperatorStatusAfterInitiation,
    ]
  )

  return {
    sendTransaction,
    status: deauthorizationTxStatus,
    updateOperatorTxStatus,
  }
}
