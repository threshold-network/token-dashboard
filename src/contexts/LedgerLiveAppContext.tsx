import { Account } from "@ledgerhq/wallet-api-client"
import React, { createContext, useState } from "react"

interface LedgerLiveAppContextState {
  ethAccount: Account | undefined
  btcAccount: Account | undefined
  setEthAccount: React.Dispatch<React.SetStateAction<Account | undefined>>
  setBtcAccount: React.Dispatch<React.SetStateAction<Account | undefined>>
}

export const LedgerLiveAppContext = createContext<LedgerLiveAppContextState>({
  ethAccount: undefined,
  btcAccount: undefined,
  setEthAccount: () => {},
  setBtcAccount: () => {},
})

export const LedgerLiveAppProvider: React.FC = ({ children }) => {
  const [ethAccount, setEthAccount] = useState<Account | undefined>(undefined)
  const [btcAccount, setBtcAccount] = useState<Account | undefined>(undefined)

  return (
    <LedgerLiveAppContext.Provider
      value={{
        ethAccount,
        setEthAccount,
        btcAccount,
        setBtcAccount,
      }}
    >
      {children}
    </LedgerLiveAppContext.Provider>
  )
}
