import { Account, WalletAPIClient } from "@ledgerhq/wallet-api-client"
import { useRequestAccount as useWalletApiRequestAccount } from "@ledgerhq/wallet-api-client-react"
import { useCallback, useContext, useEffect } from "react"
import { LedgerLiveAppContext } from "../../contexts/LedgerLiveAppContext"
import { useThreshold } from "../../contexts/ThresholdContext"
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

export function useRequestEthereumAccount(): UseRequestAccountReturn {
  const { setEthAccount } = useContext(LedgerLiveAppContext)
  const { walletApiReactTransport } = useContext(WalletApiReactTransportContext)
  const useRequestAccountReturn = useWalletApiRequestAccount()
  const { account, requestAccount } = useRequestAccountReturn
  const threshold = useThreshold()

  useEffect(() => {
    setEthAccount(account || undefined)
    threshold.tbtc.setLedgerLiveAppEthAccount(account || undefined)
  }, [account])

  const requestEthereumAccount = useCallback(async () => {
    // TODO: Get currencyId based on the chainId
    walletApiReactTransport.connect()
    await requestAccount({ currencyIds: ["ethereum_goerli"] })
    walletApiReactTransport.disconnect()
  }, [requestAccount, walletApiReactTransport])

  return { ...useRequestAccountReturn, requestAccount: requestEthereumAccount }
}
