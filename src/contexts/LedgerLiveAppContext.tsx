import React, { createContext, useState } from "react"

interface LedgerLiveAppContextState {
  ethAddress: string | undefined
  btcAddress: string | undefined
  setEthAddress: React.Dispatch<React.SetStateAction<string | undefined>>
  setBtcAddress: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const LedgerLiveAppContext = createContext<LedgerLiveAppContextState>({
  ethAddress: undefined,
  btcAddress: undefined,
  setEthAddress: () => {},
  setBtcAddress: () => {},
})

export const LedgerLiveAppProvider: React.FC = ({ children }) => {
  const [ethAddress, setEthAddress] = useState<string | undefined>(undefined)
  const [btcAddress, setBtcAddress] = useState<string | undefined>(undefined)

  return (
    <LedgerLiveAppContext.Provider
      value={{
        ethAddress,
        setEthAddress,
        btcAddress,
        setBtcAddress,
      }}
    >
      {children}
    </LedgerLiveAppContext.Provider>
  )
}
