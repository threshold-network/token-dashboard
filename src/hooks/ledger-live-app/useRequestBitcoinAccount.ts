import { Account, WalletAPIClient } from "@ledgerhq/wallet-api-client"
import { useRequestAccount as useWalletApiRequestAccount } from "@ledgerhq/wallet-api-client-react"
import { useCallback, useEffect } from "react"
import { useLedgerLiveApp } from "../../contexts/LedgerLiveAppContext"
import { useWalletApiReactTransport } from "../../contexts/TransportProvider"
import { supportedChainId } from "../../utils/getEnvVariable"

type UseRequestAccountState = {
  pending: boolean
  account: Account | null
  error: unknown
}

type RequestAccountParams = Parameters<WalletAPIClient["account"]["request"]>

type UseRequestAccountReturn = {
  requestAccount: (...params: RequestAccountParams) => Promise<void>
} & UseRequestAccountState

export function useRequestBitcoinAccount(): UseRequestAccountReturn {
  const { setBtcAccount } = useLedgerLiveApp()
  const { walletApiReactTransport } = useWalletApiReactTransport()
  const useRequestAccountReturn = useWalletApiRequestAccount()
  const { account, requestAccount } = useRequestAccountReturn

  useEffect(() => {
    setBtcAccount(account || undefined)
  }, [account])

  const requestBitcoinAccount = useCallback(async () => {
    const currencyId = supportedChainId === "1" ? "bitcoin" : "bitcoin_testnet"
    walletApiReactTransport.connect()
    await requestAccount({ currencyIds: [currencyId] })
    walletApiReactTransport.disconnect()
  }, [requestAccount, walletApiReactTransport, supportedChainId])

  return { ...useRequestAccountReturn, requestAccount: requestBitcoinAccount }
}
