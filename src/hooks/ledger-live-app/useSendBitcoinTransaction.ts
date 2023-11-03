import { useSignAndBroadcastTransaction } from "@ledgerhq/wallet-api-client-react"
import BigNumber from "bignumber.js"
import { useCallback, useContext, useEffect } from "react"
import { LedgerLiveAppContext } from "../../contexts/LedgerLiveAppContext"

type UseSendBitcoinTransactionState = {
  pending: boolean
  transactionHash: string | null
  error: unknown
}

type SendBitcoinTransactionParams = Parameters<
  (amount: string, recipient: string) => {}
>

type UseSendBitcoinTransactionReturn = {
  sendBitcoinTransaction: (
    ...params: SendBitcoinTransactionParams
  ) => Promise<void>
} & UseSendBitcoinTransactionState

export function useSendBitcoinTransaction(): UseSendBitcoinTransactionReturn {
  const { btcAccount } = useContext(LedgerLiveAppContext)
  const useSignAndBroadcastTransactionReturn = useSignAndBroadcastTransaction()
  const { signAndBroadcastTransaction, ...rest } =
    useSignAndBroadcastTransactionReturn

  const sendBitcoinTransaction = useCallback(
    async (amount, recipient) => {
      if (!btcAccount) {
        throw new Error("Bitcoin account was not connected.")
      }

      const bitcoinTransaction = {
        family: "bitcoin" as const,
        amount: new BigNumber(amount),
        recipient: recipient,
      }

      await signAndBroadcastTransaction(btcAccount.id, bitcoinTransaction)
    },
    [signAndBroadcastTransaction, btcAccount?.id]
  )

  return { ...rest, sendBitcoinTransaction }
}
