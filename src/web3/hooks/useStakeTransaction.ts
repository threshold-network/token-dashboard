import { useCallback } from "react"
import { ContractTransaction } from "@ethersproject/contracts"
import { useSendTransaction } from "./useSendTransaction"
import { useTStakingContract } from "./useTStakingContract"
import { ModalType } from "../../enums"
import { useModal } from "../../hooks/useModal"
import { useApproveTStaking } from "./useApproveTStaking"
import { BigNumber } from "ethers"
import { useTStakingAllowance } from "./useTStakingAllowance"
import doesErrorInclude from "../utils/doesErrorInclude"

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
  const stakingContract = useTStakingContract()
  const { openModal } = useModal()
  const { approve } = useApproveTStaking()

  const onError = (error: any) => {
    if (doesErrorInclude(error, CommonStakingErrors.ProviderInUse)) {
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
    stakingContract!,
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
      const isApprovedForAmount = BigNumber.from(amount).lte(allowance)
      if (!isApprovedForAmount) {
        await approve(amount.toString())
      }
      await sendTransaction(stakingProvider, beneficiary, authorizer, amount)
    },
    [sendTransaction, stakingContract?.address, allowance, approve]
  )

  return { stake, status }
}
