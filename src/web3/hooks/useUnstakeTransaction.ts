import { useCallback } from "react"
import { ContractTransaction } from "@ethersproject/contracts"
import { useSendTransaction } from "./useSendTransaction"
import { useTStakingContract } from "./useTStakingContract"
import { useModal } from "../../hooks/useModal"
import doesErrorInclude from "../utils/doesErrorInclude"
import { ModalType, UnstakeType } from "../../enums"

interface UnstakeRequest {
  amount: string | number
  stakingProvider: string
}

enum CommonUnStakingErrors {
  tooEarly = "unstake earlier than 24h",
}

const unstakeTypeToContractFunctionName: Record<UnstakeType, string> = {
  [UnstakeType.NATIVE]: "unstakeT",
  [UnstakeType.LEGACY_KEEP]: "unstakeKeep",
  [UnstakeType.LEGACY_NU]: "unstakeNu",
  [UnstakeType.ALL]: "unstakeAll",
}

const useUnstakeTransaction = (
  type: UnstakeType,
  onSuccess: (tx: ContractTransaction) => void
) => {
  const { openModal } = useModal()

  const stakingContract = useTStakingContract()

  const onError = (error: any) => {
    if (doesErrorInclude(error, CommonUnStakingErrors.tooEarly)) {
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
    unstakeTypeToContractFunctionName[type],
    onSuccess,
    onError
  )

  const unstake = useCallback(
    async ({ amount, stakingProvider }: UnstakeRequest) => {
      const args =
        type === UnstakeType.NATIVE || type == UnstakeType.LEGACY_NU
          ? [stakingProvider, amount]
          : [stakingProvider]

      await sendTransaction(...args)
    },
    [sendTransaction, type]
  )

  return { unstake, status }
}

export default useUnstakeTransaction
