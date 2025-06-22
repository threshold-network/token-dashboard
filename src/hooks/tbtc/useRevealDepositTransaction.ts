import { useThreshold } from "../../contexts/ThresholdContext"
import {
  OnErrorCallback,
  OnSuccessCallback,
  useSendTransactionFromFn,
} from "../../web3/hooks"
import { useNonEVMConnection } from "../useNonEVMConnection"

export const useRevealDepositTransaction = (
  onSuccess?: OnSuccessCallback,
  onError?: OnErrorCallback
) => {
  const threshold = useThreshold()
  const { nonEVMPublicKey } = useNonEVMConnection()
  const pendingText = nonEVMPublicKey
    ? "Please wait for the transaction to be confirmed"
    : "Please confirm the transaction in your wallet"

  return useSendTransactionFromFn(
    threshold.tbtc.revealDeposit,
    onSuccess,
    onError,
    pendingText
  )
}
