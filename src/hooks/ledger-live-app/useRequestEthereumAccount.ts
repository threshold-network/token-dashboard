import { Account, WalletAPIClient } from "@ledgerhq/wallet-api-client"
import { useRequestAccount as useWalletApiRequestAccount } from "@ledgerhq/wallet-api-client-react"
import { useCallback, useContext, useEffect } from "react"
import { LedgerLiveAppContext } from "../../contexts/LedgerLiveAppContext"
import {
  useIsTbtcSdkInitializing,
  useThreshold,
} from "../../contexts/ThresholdContext"
import { WalletApiReactTransportContext } from "../../contexts/TransportProvider"
import { walletConnected } from "../../store/account"
import { useAppDispatch } from "../store/useAppDispatch"

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
  const dispatch = useAppDispatch()
  const { setIsSdkInitializing } = useIsTbtcSdkInitializing()

  useEffect(() => {
    // Setting the eth account in LedgerLiveAppContext through `setEthAccount`
    // method will trigger the useEffect in Threshold Context that will
    // reinitialize the lib and tBTC SDK. We can set the is initializing flag
    // here to indicate as early as as possible that the sdk is in the
    // initializing process.
    setIsSdkInitializing(true)
    setEthAccount(account || undefined)
    dispatch(walletConnected(account?.address || ""))
  }, [account])

  const requestEthereumAccount = useCallback(async () => {
    // TODO: Get currencyId based on the chainId
    walletApiReactTransport.connect()
    await requestAccount({ currencyIds: ["ethereum_goerli"] })
    walletApiReactTransport.disconnect()
  }, [requestAccount, walletApiReactTransport])

  return { ...useRequestAccountReturn, requestAccount: requestEthereumAccount }
}
