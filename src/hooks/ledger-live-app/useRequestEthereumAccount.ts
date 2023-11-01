import { Account, WalletAPIClient } from "@ledgerhq/wallet-api-client"
import { useContext, useState, useCallback, useMemo } from "react"
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

const initialState: UseRequestAccountState = {
  pending: false,
  account: null,
  error: null,
}

export function useRequestEthereumAccount(): UseRequestAccountReturn {
  const [state, setState] = useState<UseRequestAccountState>(initialState)
  const threshold = useThreshold()
  const ledgerEthereumManager =
    threshold.tbtc.ledgerLiveAppManager?.ethereumManager

  const requestAccount = useCallback(
    async (...params: RequestAccountParams) => {
      try {
        setState((oldState) => ({
          ...oldState,
          pending: true,
          error: null,
        }))

        if (!ledgerEthereumManager) {
          throw new Error("Ledger Live Ethereum Manager is not initialized")
        }

        const account = await ledgerEthereumManager.connectAccount(...params)

        setState((oldState) => ({
          ...oldState,
          pending: false,
          account,
        }))
      } catch (error) {
        setState((oldState) => ({
          ...oldState,
          pending: false,
          error,
        }))
      }
    },
    [ledgerEthereumManager]
  )

  const result = useMemo(
    () => ({
      requestAccount,
      ...state,
    }),
    [requestAccount, state]
  )

  return result
}
