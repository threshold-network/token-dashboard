import { useCallback } from "react"
import { useSendTransaction } from "./useSendTransaction"
import { useTStakingContract } from "./useTStakingContract"

export const useStakeTransaction = (onSuccess: () => void) => {
  const stakingContract = useTStakingContract()
  const { sendTransaction, status } = useSendTransaction(
    stakingContract!,
    "stake",
    onSuccess
  )

  const stake = useCallback(
    async (...args) => {
      await sendTransaction(...args)
    },
    [sendTransaction, stakingContract?.address]
  )

  return { stake, status }
}
