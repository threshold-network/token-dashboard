import { useSignAndBroadcastTransaction } from "@ledgerhq/wallet-api-client-react"
import BigNumber from "bignumber.js"
import { useCallback } from "react"
import { useLedgerLiveApp } from "../../contexts/LedgerLiveAppContext"
import { useWalletApiReactTransport } from "../../contexts/TransportProvider"

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
  const { btcAccount } = useLedgerLiveApp()
  const { walletApiReactTransport } = useWalletApiReactTransport()
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
      walletApiReactTransport.connect()
      await signAndBroadcastTransaction(btcAccount.id, bitcoinTransaction)
      walletApiReactTransport.disconnect()
    },
    [signAndBroadcastTransaction, btcAccount?.id, walletApiReactTransport]
  )

  return { ...rest, sendBitcoinTransaction }
}
