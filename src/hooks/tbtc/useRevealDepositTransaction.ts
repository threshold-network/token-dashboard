import { TransactionReceipt } from "@ethersproject/providers"
import { useThreshold } from "../../contexts/ThresholdContext"
import { useSendTransactionFromFn } from "../../web3/hooks"

export const useRevealDepositTransaction = (
  onSuccess?: (tx: TransactionReceipt) => void | Promise<void>,
  onError?: (error: any) => void | Promise<void>
) => {
  const threshold = useThreshold()

  return useSendTransactionFromFn(
    threshold.tbtc.revealDeposit,
    onSuccess,
    onError
  )
}
