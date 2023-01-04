import { useCallback } from "react"
import { useThreshold } from "../../contexts/ThresholdContext"
import { useModal } from "../useModal"
import { ModalType } from "../../enums"
import { useRevealDepositTransaction } from "./useRevealDepositTransaction"
import { UnspentTransactionOutput } from "@keep-network/tbtc-v2.ts/dist/bitcoin"
import {
  Deposit,
  DepositScriptParameters,
} from "@keep-network/tbtc-v2.ts/dist/deposit"
import { BigNumber } from "ethers"

export const useRevealMultipleDepositsTransaction = () => {
  const { openModal } = useModal()

  const { sendTransaction, status } = useRevealDepositTransaction()

  const revealMultipleDeposits = useCallback(
    async (
      utxos: UnspentTransactionOutput[],
      deposit: DepositScriptParameters
    ) => {
      try {
        if (utxos.length === 0) throw new Error("No utxos passed.")

        const successfullTxs: {
          txHash: string
          amount: BigNumber
        }[] = []
        for (const utxo of utxos) {
          const tx = await sendTransaction(utxo, deposit)
          if (tx) {
            console.log("tx", tx)
            successfullTxs.push({ txHash: tx.hash, amount: utxo.value })
          }
        }
        if (successfullTxs.length > 0) {
          return true
        }
      } catch (error) {
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
