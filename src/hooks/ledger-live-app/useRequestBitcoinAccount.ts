import { Account, WalletAPIClient } from "@ledgerhq/wallet-api-client"
import { useRequestAccount as useWalletApiRequestAccount } from "@ledgerhq/wallet-api-client-react"
import { useCallback, useEffect } from "react"
import { useLedgerLiveApp } from "../../contexts/LedgerLiveAppContext"
import { useWalletApiReactTransport } from "../../contexts/TransportProvider"
import { useWeb3React } from "@web3-react/core"
import { isTestnetNetwork } from "../../networks/utils"
import { useDefaultOrConnectedChainId } from "../../networks/hooks/useDefaultOrConnectedChainId"
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
  const { chainId } = useWeb3React()
  const { isEmbed } = useIsEmbed()

  useEffect(() => {
    if (isEmbed) setBtcAccount(account || undefined)
  }, [account, isEmbed])

  const requestBitcoinAccount = useCallback(async () => {
    const defaultOrConnectedChainId = useDefaultOrConnectedChainId()
    const currencyId = isTestnetNetwork(defaultOrConnectedChainId)
      ? "bitcoin_testnet"
      : "bitcoin"

    walletApiReactTransport.connect()
    await requestAccount({ currencyIds: [currencyId] })
    walletApiReactTransport.disconnect()
  }, [requestAccount, walletApiReactTransport, chainId])

  return { ...useRequestAccountReturn, requestAccount: requestBitcoinAccount }
}
