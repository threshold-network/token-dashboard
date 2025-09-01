import { useThreshold } from "../../contexts/ThresholdContext"
import {
  OnErrorCallback,
  OnSuccessCallback,
  useSendTransactionFromFn,
} from "../../web3/hooks"

export const useApproveL2TBTCToken = (
  onSuccess?: OnSuccessCallback,
  onError?: OnErrorCallback
) => {
  const threshold = useThreshold()
  const pendingText =
    "Approving tBTC for cross-chain redemption. Please sign in your wallet."

  return useSendTransactionFromFn(
    threshold.tbtc.approveL2TBTCToken,
    onSuccess,
    onError,
    pendingText
  )
}
