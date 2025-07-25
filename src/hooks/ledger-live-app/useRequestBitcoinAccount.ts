import { Account, WalletAPIClient } from "@ledgerhq/wallet-api-client"
import { useRequestAccount as useWalletApiRequestAccount } from "@ledgerhq/wallet-api-client-react"
import { useCallback, useEffect } from "react"
import { useLedgerLiveApp } from "../../contexts/LedgerLiveAppContext"
import { useWalletApiReactTransport } from "../../contexts/TransportProvider"
import { isTestnetChainId } from "../../networks/utils"
import { useConnectedOrDefaultEthereumChainId } from "../../networks/hooks/useConnectedOrDefaultEthereumChainId"
import { useIsEmbed } from "../useIsEmbed"

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
  const { isEmbed } = useIsEmbed()
  const defaultOrConnectedChainId = useConnectedOrDefaultEthereumChainId()

  useEffect(() => {
    if (isEmbed) setBtcAccount(account || undefined)
  }, [account, isEmbed])

  const requestBitcoinAccount = useCallback(async () => {
    const currencyId = isTestnetChainId(defaultOrConnectedChainId)
      ? "bitcoin_testnet"
      : "bitcoin"

    walletApiReactTransport.connect()
    await requestAccount({ currencyIds: [currencyId] })
    walletApiReactTransport.disconnect()
  }, [requestAccount, walletApiReactTransport, defaultOrConnectedChainId])

  return { ...useRequestAccountReturn, requestAccount: requestBitcoinAccount }
}
