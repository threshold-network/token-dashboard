import { useCallback } from "react"
import { ContractTransaction } from "@ethersproject/contracts"
import { useSendTransaction } from "./useSendTransaction"
import { useTStakingContract } from "./useTStakingContract"

interface UnstakeRequest {
  amount: string | number
  operator: string
  beneficiary: string
  authorizer: string
}

const useUnstakeTransaction = (
  onSuccess: (tx: ContractTransaction) => void
) => {
  const stakingContract = useTStakingContract()

  const { sendTransaction, status } = useSendTransaction(
    stakingContract!,
    "unstake",
    onSuccess
  )

  const unstake = useCallback(
    async ({ amount, operator }: UnstakeRequest) => {
      await sendTransaction(operator, amount)
    },
    [sendTransaction, stakingContract?.address]
  )

  return { unstake, status }
}

export default useUnstakeTransaction
