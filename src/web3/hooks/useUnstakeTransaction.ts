import { useCallback } from "react"
import { ContractTransaction } from "@ethersproject/contracts"
import { useSendTransaction } from "./useSendTransaction"
import { useTStakingContract } from "./useTStakingContract"

interface UnstakeRequest {
  amount: string | number
  stakingProvider: string
}

const useUnstakeTransaction = (
  onSuccess: (tx: ContractTransaction) => void
) => {
  const stakingContract = useTStakingContract()

  const { sendTransaction, status } = useSendTransaction(
    stakingContract!,
    "unstakeT",
    onSuccess
  )

  const unstake = useCallback(
    async ({ amount, stakingProvider }: UnstakeRequest) => {
      await sendTransaction(stakingProvider, amount)
    },
    [sendTransaction, stakingContract?.address]
  )

  return { unstake, status }
}

export default useUnstakeTransaction
