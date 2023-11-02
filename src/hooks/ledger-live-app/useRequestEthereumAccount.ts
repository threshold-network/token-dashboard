import { Account, WalletAPIClient } from "@ledgerhq/wallet-api-client"
import { useRequestAccount as useWalletApiRequestAccount } from "@ledgerhq/wallet-api-client-react"
import { useCallback, useContext, useEffect } from "react"
import { LedgerLiveAppContext } from "../../contexts/LedgerLiveAppContext"
import { useThreshold } from "../../contexts/ThresholdContext"

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
  const { setEthAddress } = useContext(LedgerLiveAppContext)
  const useRequestAccountReturn = useWalletApiRequestAccount()
  const { account, requestAccount } = useRequestAccountReturn
  const threshold = useThreshold()

  useEffect(() => {
    // TODO: Get currencyId based on the chainId
    if (account && account.address && account?.currency === "ethereum_goerli") {
      setEthAddress(account?.address || undefined)
      threshold.tbtc.setLedgerLiveAppEthAccount(account)
    }

    if (!account || !account.address) {
      setEthAddress(undefined)
    }
  }, [account])

  const requestEthereumAccount = useCallback(async () => {
    // TODO: Get currencyId based on the chainId
    await requestAccount({ currencyIds: ["ethereum_goerli"] })
  }, [requestAccount])

  return { ...useRequestAccountReturn, requestAccount: requestEthereumAccount }
}
