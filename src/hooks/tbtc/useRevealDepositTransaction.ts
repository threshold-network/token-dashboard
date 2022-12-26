import { ContractTransaction } from "ethers"
import { useThreshold } from "../../contexts/ThresholdContext"
import { useSendTransactionFromFn } from "../../web3/hooks"

export const useRevealDepositTransaction = (
  onSuccess?: (tx: ContractTransaction) => void | Promise<void>,
  onError?: (error: any) => void | Promise<void>
) => {
  const threshold = useThreshold()

  return useSendTransactionFromFn(
    threshold.tbtc.revealDeposit,
    onSuccess,
    onError
  )
}
