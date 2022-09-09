import { useCallback } from "react"
import { ContractTransaction } from "@ethersproject/contracts"
import { useSendTransaction } from "./useSendTransaction"
import { useTbtcBridgeContract } from "./useTbtcBridgeContract"
import { ModalType } from "../../enums"
import { useModal } from "../../hooks/useModal"

interface TbtcMintRequest {}

export const useTbtcMintTransaction = (
  onSuccess: (tx: ContractTransaction) => void
) => {
  const tbtcBridgeContract = useTbtcBridgeContract()
  const { openModal } = useModal()

  const onError = (error: any) => {
    openModal(ModalType.TransactionFailed, {
      error,
      isExpandableError: true,
    })
  }

  const { sendTransaction, status } = useSendTransaction(
    tbtcBridgeContract!,
    // TODO: Change the method name to the correct one
    "SOME_METHOD",
    onSuccess,
    onError
  )

  const mint = useCallback(
    async ({}: TbtcMintRequest) => {
      await sendTransaction()
    },
    [sendTransaction]
  )

  return { mint, status }
}
