import { useCallback } from "react"
import { ContractTransaction } from "@ethersproject/contracts"
import { useSendTransaction } from "./useSendTransaction"
import { useTStakingContract } from "./useTStakingContract"
import { ModalType } from "../../enums"
import { useModal } from "../../hooks/useModal"
import { useApproveTStaking } from "./useApproveTStaking"
import { BigNumber } from "ethers"
import { useTStakingAllowance } from "./useTStakingAllowance"
import useCheckDuplicateProviderAddress from "./useCheckDuplicateProviderAddress"

interface StakeRequest {
  amount: string | number
  stakingProvider: string
  beneficiary: string
  authorizer: string
}

enum CommonStakingErrors {
  ProviderInUse = "Provider is already in use",
}

export const useStakeTransaction = (
  onSuccess: (tx: ContractTransaction) => void
) => {
  const tStakingContract = useTStakingContract()

  const { openModal } = useModal()
  const { approve } = useApproveTStaking()

  const checkIfProviderUsed = useCheckDuplicateProviderAddress()

  const onError = (error: any) => {
    if (
      error?.data?.message.includes(CommonStakingErrors.ProviderInUse) ||
      error?.message.includes(CommonStakingErrors.ProviderInUse)
    ) {
      // send the user back to the first staking step, but with validated form fields
      openModal(ModalType.ConfirmStakingParams, {
        stakingProviderInUse: true,
      })
    } else {
      openModal(ModalType.TransactionFailed, {
        error,
        isExpandableError: true,
      })
    }
  }

  const { sendTransaction, status } = useSendTransaction(
    tStakingContract!,
    "stake",
    onSuccess,
    onError
  )

  const allowance = useTStakingAllowance()

  const stake = useCallback(
    async ({
      amount,
      stakingProvider,
      beneficiary,
      authorizer,
    }: StakeRequest) => {
      const { isProviderUsedForKeep, isProviderUsedForT } =
        await checkIfProviderUsed(stakingProvider)

      if (isProviderUsedForKeep || isProviderUsedForT) {
        openModal(ModalType.ConfirmStakingParams, {
          isProviderUsedForKeep,
          isProviderUsedForT,
        })
        return
      }

      const isApprovedForAmount = BigNumber.from(amount).lte(allowance)

      if (!isApprovedForAmount) {
        await approve(amount.toString())
      }

      await sendTransaction(stakingProvider, beneficiary, authorizer, amount)
    },
    [sendTransaction, tStakingContract?.address, allowance, approve]
  )

  return { stake, status }
}
