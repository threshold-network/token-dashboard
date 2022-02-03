import { useCallback } from "react"
import { ContractTransaction } from "@ethersproject/contracts"
import { useSendTransaction } from "./useSendTransaction"
import { useTStakingContract } from "./useTStakingContract"
import { ModalType } from "../../enums"
import { useModal } from "../../hooks/useModal"

interface UnstakeRequest {
  amount: string | number
  stakingProvider: string
}

enum CommonUnStakingErrors {
  tooEarly = "unstake earlier than 24h",
}

const useUnstakeTransaction = (
  onSuccess: (tx: ContractTransaction) => void
) => {
  const { openModal } = useModal()

  const stakingContract = useTStakingContract()

  const onError = (error: any) => {
    if (
      error?.data?.message.includes(CommonUnStakingErrors.tooEarly) ||
      error?.message.includes(CommonUnStakingErrors.tooEarly)
    ) {
      openModal(ModalType.TransactionFailed, {
        error: new Error(
          "Your stake is locked for 24 hours after deposit. Please check back after if you would like to unstake"
        ),
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
    "unstakeT",
    onSuccess,
    onError
  )

  const unstake = useCallback(
    async ({ amount, stakingProvider }: UnstakeRequest) => {
      await sendTransaction(stakingProvider, amount)
    },
    [sendTransaction, stakingContract?.address]
  )

  return { unstake, status }
}

export default useUnstakeTransaction
