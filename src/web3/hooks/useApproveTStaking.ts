import { useCallback } from "react"
import { useToken } from "../../hooks/useToken"
import { useSendTransaction } from "./useSendTransaction"
import { Token } from "../../enums"
import { useTStakingContract } from "./useTStakingContract"
import { MaxUint256 } from "@ethersproject/constants"

export const useApproveTStaking = (onSuccess: () => Promise<void>) => {
  const { contract: TTokenContract } = useToken(Token.T)
  const tStakingContract = useTStakingContract()
  const { sendTransaction, status } = useSendTransaction(
    TTokenContract!,
    "approve",
    onSuccess
  )

  const approveTStaking = useCallback(async () => {
    await sendTransaction(tStakingContract?.address, MaxUint256.toString())
  }, [sendTransaction, tStakingContract?.address])

  return { approveTStaking, status }
}
