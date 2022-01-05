import { useCallback } from "react"
import { useToken } from "../../hooks/useToken"
import { useSendTransaction } from "./useSendTransaction"
import { useVendingMachineContract } from "./useVendingMachineContract"
import { UpgredableToken } from "../../types"
import { Token } from "../../enums"
import { useTStakingContract } from "./useTStakingContract"
import { useT } from "./useT"
import { MaxUint256 } from "@ethersproject/constants"

export const useApproveTStaking = () => {
  const { contract: TTokenContract } = useToken(Token.T)
  const tStakingContract = useTStakingContract()
  const { sendTransaction, status } = useSendTransaction(
    TTokenContract!,
    "approve"
  )

  const approveTStaking = useCallback(async () => {
    await sendTransaction(tStakingContract?.address, MaxUint256.toString())
  }, [sendTransaction, tStakingContract?.address])

  return { approveTStaking, status }
}
