import { useCallback } from "react"
import { ContractTransaction } from "@ethersproject/contracts"
import { useSendTransaction } from "./useSendTransaction"
import { useTStakingContract } from "./useTStakingContract"
import { useApproveTStaking } from "./useApproveTStaking"
import { BigNumber } from "ethers"
import { useTStakingAllowance } from "./useTStakingAllowance"

interface TopupRequest {
  amount: string | number
  operator: string
}

export const useTopupTransaction = (
  onSuccess: (tx: ContractTransaction) => void
) => {
  const stakingContract = useTStakingContract()
  const { approve } = useApproveTStaking()

  const { sendTransaction, status } = useSendTransaction(
    stakingContract!,
    "topUp",
    onSuccess
  )

  const allowance = useTStakingAllowance()

  const topup = useCallback(
    async ({ amount, operator }: TopupRequest) => {
      const isApprovedForAmount = BigNumber.from(amount).lte(allowance)
      if (!isApprovedForAmount) {
        await approve(amount.toString())
      }

      await sendTransaction(operator, amount)
    },
    [sendTransaction, stakingContract?.address, allowance, approve]
  )

  return { topup, status }
}
