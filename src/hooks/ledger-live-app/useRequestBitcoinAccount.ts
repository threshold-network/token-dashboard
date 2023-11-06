import { Account, WalletAPIClient } from "@ledgerhq/wallet-api-client"
import { useRequestAccount as useWalletApiRequestAccount } from "@ledgerhq/wallet-api-client-react"
import { useCallback, useContext, useEffect } from "react"
import { LedgerLiveAppContext } from "../../contexts/LedgerLiveAppContext"
import { WalletApiReactTransportContext } from "../../contexts/TransportProvider"

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
  const { setBtcAccount } = useContext(LedgerLiveAppContext)
  const { walletApiReactTransport } = useContext(WalletApiReactTransportContext)
  const useRequestAccountReturn = useWalletApiRequestAccount()
  const { account, requestAccount } = useRequestAccountReturn

  useEffect(() => {
    setBtcAccount(account || undefined)
  }, [account])

  const requestBitcoinAccount = useCallback(async () => {
    // TODO: Get currencyId based on the chainId
    walletApiReactTransport.connect()
    await requestAccount({ currencyIds: ["bitcoin_testnet"] })
    walletApiReactTransport.disconnect()
  }, [requestAccount, walletApiReactTransport])

  return { ...useRequestAccountReturn, requestAccount: requestBitcoinAccount }
}