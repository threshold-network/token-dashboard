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

export function useRequestBitcoinAccount(): UseRequestAccountReturn {
  const { setBtcAddress } = useContext(LedgerLiveAppContext)
  const useRequestAccountReturn = useWalletApiRequestAccount()
  const { account, requestAccount } = useRequestAccountReturn

  useEffect(() => {
    setBtcAddress(account?.address || undefined)
  }, [account])

  const requestBitcoinAccount = useCallback(async () => {
    // TODO: Get currencyId based on the chainId
    await requestAccount({ currencyIds: ["bitcoin_testnet"] })
  }, [requestAccount])

  return { ...useRequestAccountReturn, requestAccount: requestBitcoinAccount }
}
