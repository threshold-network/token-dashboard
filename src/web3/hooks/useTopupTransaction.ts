import { useCallback } from "react"
import { OnSuccessCallback, useSendTransaction } from "./useSendTransaction"
import { useTStakingContract } from "./useTStakingContract"
import { useApproveTStaking } from "./useApproveTStaking"
import { BigNumber } from "ethers"
import { useTStakingAllowance } from "./useTStakingAllowance"
import { TopUpType } from "../../enums"

interface TopupRequest {
  amount: string | number
  stakingProvider: string
}
const topUpTypeToContractFunctionName: Record<TopUpType, string> = {
  [TopUpType.NATIVE]: "topUp",
  [TopUpType.LEGACY_KEEP]: "topUpKeep",
  [TopUpType.LEGACY_NU]: "topUpNu",
}

export const useTopupTransaction = (
  type: TopUpType,
  onSuccess: OnSuccessCallback
) => {
  const stakingContract = useTStakingContract()
  const { approve } = useApproveTStaking()

  const { sendTransaction, status } = useSendTransaction(
    stakingContract!,
    topUpTypeToContractFunctionName[type],
    onSuccess
  )

  const allowance = useTStakingAllowance()

  const topup = useCallback(
    async ({ amount, stakingProvider }: TopupRequest) => {
      const isApprovedForAmount = BigNumber.from(amount).lte(allowance)
      if (type === TopUpType.NATIVE && !isApprovedForAmount) {
        await approve(amount.toString())
      }
      const args =
        type === TopUpType.NATIVE
          ? [stakingProvider, amount]
          : [stakingProvider]

      await sendTransaction(...args)
    },
    [sendTransaction, allowance, approve, type]
  )

  return { topup, status }
}
