import { Account } from "@ledgerhq/wallet-api-client"
import React, { createContext, useCallback, useContext, useState } from "react"
import { LedgerLiveAppEthereumSigner } from "../ledger-live-app-eth-signer"
import { ledgerLiveAppEthereumSigner } from "../utils/getLedgerLiveAppEthereumSigner"

interface LedgerLiveAppContextState {
  ethAccount: Account | undefined
  btcAccount: Account | undefined
  setEthAccount: (ethAccount: Account | undefined) => void
  setBtcAccount: (btcAccount: Account | undefined) => void
  ledgerLiveAppEthereumSigner: LedgerLiveAppEthereumSigner | undefined
}

export const useLedgerLiveApp = () => {
  return useContext(LedgerLiveAppContext)
}

const LedgerLiveAppContext = createContext<LedgerLiveAppContextState>({
  ethAccount: undefined,
  btcAccount: undefined,
  setEthAccount: () => {},
  setBtcAccount: () => {},
  ledgerLiveAppEthereumSigner: undefined,
})

export const LedgerLiveAppProvider: React.FC = ({ children }) => {
  const [ethAccount, _setEthAccount] = useState<Account | undefined>(undefined)
  const [btcAccount, setBtcAccount] = useState<Account | undefined>(undefined)

  const setEthAccount = useCallback((ethAccount: Account | undefined) => {
    ledgerLiveAppEthereumSigner.setAccount(ethAccount)
    _setEthAccount(ethAccount)
  }, [])

  return (
    <LedgerLiveAppContext.Provider
      value={{
        ethAccount,
        setEthAccount,
        btcAccount,
        setBtcAccount,
        ledgerLiveAppEthereumSigner,
      }}
    >
      {children}
    </LedgerLiveAppContext.Provider>
  )
}
