import { useThreshold } from "../../contexts/ThresholdContext"
import {
  OnErrorCallback,
  OnSuccessCallback,
  useSendTransactionFromFn,
} from "../../web3/hooks"

export const useRequestRedemption = (
  onSuccess?: OnSuccessCallback,
  onError?: OnErrorCallback
) => {
  const threshold = useThreshold()
  const pendingText =
    "Finding an active wallet with sufficient funds to proceed with your unmint. Please wait for the transaction prompt, and then sign in your wallet."

  return useSendTransactionFromFn(
    threshold.tbtc.requestRedemption,
    onSuccess,
    onError,
    pendingText
  )
}
