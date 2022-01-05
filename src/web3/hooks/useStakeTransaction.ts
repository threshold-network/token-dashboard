import { useCallback } from "react"
import { useSendTransaction } from "./useSendTransaction"
import { useTStakingContract } from "./useTStakingContract"

export const useStakeTransaction = () => {
  const stakingContract = useTStakingContract()
  const { sendTransaction, status } = useSendTransaction(
    stakingContract!,
    "stake"
  )

  const stake = useCallback(
    async (...args) => {
      await sendTransaction(...args)
    },
    [sendTransaction, stakingContract?.address]
  )

  return { stake, status }
}
