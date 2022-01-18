import { useCallback } from "react"
import { ContractTransaction } from "@ethersproject/contracts"
import { useSendTransaction } from "./useSendTransaction"
import { useTStakingContract } from "./useTStakingContract"

interface UnstakeRequest {
  amount: string | number
  operator: string
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
    async ({ amount, operator }: UnstakeRequest) => {
      console.log("waiting for unstake ", amount, operator)
      await sendTransaction(operator, amount)
    },
    [sendTransaction, stakingContract?.address]
  )

  return { unstake, status }
}

export default useUnstakeTransaction
