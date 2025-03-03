import { Account, WalletAPIClient } from "@ledgerhq/wallet-api-client"
import { useRequestAccount as useWalletApiRequestAccount } from "@ledgerhq/wallet-api-client-react"
import { useCallback, useEffect } from "react"
import { useLedgerLiveApp } from "../../contexts/LedgerLiveAppContext"
import { useWalletApiReactTransport } from "../../contexts/TransportProvider"
import { walletConnected } from "../../store/account"
import { isTestnetNetwork } from "../../networks/utils"
import { useConnectedOrDefaultChainId } from "../../networks/hooks/useConnectedOrDefaultChainId"
import { useAppDispatch } from "../store/useAppDispatch"
import { useIsEmbed } from "../useIsEmbed"
import { useWeb3React } from "@web3-react/core"

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
  const { setEthAccount } = useLedgerLiveApp()
  const { walletApiReactTransport } = useWalletApiReactTransport()
  const useRequestAccountReturn = useWalletApiRequestAccount()
  const { account: ledgerLiveAccount, requestAccount } = useRequestAccountReturn
  const { chainId } = useWeb3React()
  const dispatch = useAppDispatch()
  const { isEmbed } = useIsEmbed()
  const defaultOrConnectedChainId = useConnectedOrDefaultChainId()

  useEffect(() => {
    // Setting the eth account in LedgerLiveAppContext through `setEthAccount`
    // method will trigger the useEffect in Threshold Context that will
    // reinitialize the lib and tBTC SDK. We can set the is initializing flag
    // here to indicate as early as as possible that the sdk is in the
    // initializing process.
    if (isEmbed) {
      setEthAccount(ledgerLiveAccount || undefined)
      dispatch(
        walletConnected({ address: ledgerLiveAccount?.address || "", chainId })
      )
    }
  }, [ledgerLiveAccount, chainId, isEmbed])

  const requestEthereumAccount = useCallback(async () => {
    // The Goerli testnet become deprecated. However, we did not test Ledger
    // Live on Sepolia yet, so we're leaving the Goerli config for now in the
    // code.
    const currencyId = isTestnetNetwork(defaultOrConnectedChainId)
      ? "ethereum_goerli"
      : "ethereum"
    walletApiReactTransport.connect()
    await requestAccount({ currencyIds: [currencyId] })
    walletApiReactTransport.disconnect()
  }, [requestAccount, walletApiReactTransport, defaultOrConnectedChainId])

  return { ...useRequestAccountReturn, requestAccount: requestEthereumAccount }
}
