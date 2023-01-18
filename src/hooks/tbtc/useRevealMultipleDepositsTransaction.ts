import { useCallback } from "react"
import { useModal } from "../useModal"
import { ModalType } from "../../enums"
import { UnspentTransactionOutput } from "@keep-network/tbtc-v2.ts/dist/src/bitcoin"
import { DepositScriptParameters } from "@keep-network/tbtc-v2.ts/dist/src/deposit"
import { useRevealDepositTransaction } from "."

export type RevealDepositSuccessTx = {
  txHash: string
  amount: string
}

export const useRevealMultipleDepositsTransaction = (
  onSuccess?: (txs: RevealDepositSuccessTx[]) => void | Promise<void>,
  onError?: (error: any) => void | Promise<void>
) => {
  const { openModal } = useModal()

  const { sendTransaction, status } = useRevealDepositTransaction()

  const revealMultipleDeposits = useCallback(
    async (
      utxos: UnspentTransactionOutput[],
      depositScriptParameters: DepositScriptParameters
    ) => {
      try {
        if (!utxos || utxos.length === 0)
          throw new Error("No utxos passed to revealMultipleDeposits.")

        const successfullTxs: RevealDepositSuccessTx[] = []
        for (const utxo of utxos) {
          const tx = await sendTransaction(utxo, depositScriptParameters)
          if (tx) {
            successfullTxs.push({
              txHash: tx.hash,
              amount: utxo.value.toString(),
            })
          }
        }
        if (successfullTxs.length > 0 && onSuccess) onSuccess(successfullTxs)
        if (successfullTxs.length === 0 && onError)
          onError(new Error("User rejected transaction"))
      } catch (error) {
        if (onError) onError(error)
        openModal(ModalType.TransactionFailed, {
          error: "Error: Couldn't reveal deposits",
          isExpandableError: true,
        })
      }
    },
    [sendTransaction, openModal]
  )

  return { revealMultipleDeposits, status }
}
