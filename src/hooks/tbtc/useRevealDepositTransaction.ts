import { useThreshold } from "../../contexts/ThresholdContext"
import {
  OnErrorCallback,
  OnSuccessCallback,
  useSendTransactionFromFn,
} from "../../web3/hooks"

export const useRevealDepositTransaction = (
  onSuccess?: OnSuccessCallback,
  onError?: OnErrorCallback
) => {
  const threshold = useThreshold()

  return useSendTransactionFromFn(
    threshold.tbtc.revealDeposit,
    onSuccess,
    onError
  )
}
