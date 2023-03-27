import { useCallback } from "react"
import { useThreshold } from "../../contexts/ThresholdContext"
import { ModalType } from "../../enums"
import { StakingAppName } from "../../store/staking-applications"
import {
  OnErrorCallback,
  OnSuccessCallback,
  useSendTransactionFromFn,
} from "../../web3/hooks"
import { isAddressZero } from "../../web3/utils"
import { useModal } from "../useModal"
import { stakingAppNameToThresholdAppService } from "./useStakingAppContract"
import { useUpdateOperatorStatus } from "./useUpdateOperatorStatus"

export const useInitiateDeauthorization = (
  appName: StakingAppName,
  shouldUpdateOperatorStatusAfterInitiation?: boolean,
  onSuccess?: OnSuccessCallback,
  onError?: OnErrorCallback
) => {
  const { openModal } = useModal()
  const threshold = useThreshold()
  const {
    sendTransaction: updateOperatorStatus,
    status: updateOperatorTxStatus,
  } = useUpdateOperatorStatus(appName)

  const onErrorRequestAuthorizationDecrease = useCallback(
    (error) => {
      onError?.(error)
      openModal(ModalType.TransactionFailed, {
        transactionHash: error?.transaction?.hash,
        error,
        isExpandableError: true,
      })
      throw error
    },
    [onError, openModal]
  )

  const {
    sendTransaction: requestAuthorizationDecrease,
    status: deauthorizationTxStatus,
  } = useSendTransactionFromFn(
    threshold.multiAppStaking[stakingAppNameToThresholdAppService[appName]]
      .requestAuthorizationDecrease,
    onSuccess,
    onErrorRequestAuthorizationDecrease
  )

  const sendTransaction = useCallback(
    async (stakingProvider: string, amount: string, operator?: string) => {
      try {
        await requestAuthorizationDecrease(stakingProvider, amount)
      } catch (error) {
        return
      }

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
