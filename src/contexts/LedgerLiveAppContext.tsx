import { Account } from "@ledgerhq/wallet-api-client"
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { LedgerLiveSigner } from "../utils/ledger"
import { useIsActive } from "../hooks/useIsActive"
import { getLedgerLiveAppEthereumSigner } from "../utils/getLedgerLiveAppEthereumSigner"

interface LedgerLiveAppContextState {
  ethAccount: Account | undefined
  btcAccount: Account | undefined
  setEthAccount: (ethAccount: Account | undefined) => void
  setBtcAccount: (btcAccount: Account | undefined) => void
  ethAccountChainId: number | undefined
  ledgerLiveAppEthereumSigner: LedgerLiveSigner | undefined
}

export const useLedgerLiveApp = () => {
  return useContext(LedgerLiveAppContext)
}

const LedgerLiveAppContext = createContext<LedgerLiveAppContextState>({
  ethAccount: undefined,
  btcAccount: undefined,
  setEthAccount: () => {},
  setBtcAccount: () => {},
  ethAccountChainId: undefined,
  ledgerLiveAppEthereumSigner: undefined,
})

export const LedgerLiveAppProvider: React.FC = ({ children }) => {
  const { chainId } = useIsActive()
  const [ethAccount, _setEthAccount] = useState<Account | undefined>(undefined)
  const [ethAccountChainId, setEthAccountChainId] = useState<
    number | undefined
  >(undefined)
  const [btcAccount, setBtcAccount] = useState<Account | undefined>(undefined)

  const ledgerLiveAppEthereumSigner = useMemo(() => {
    return getLedgerLiveAppEthereumSigner(chainId)
  }, [chainId])

  const setEthAccount = useCallback(
    async (ethAccount: Account | undefined) => {
      ledgerLiveAppEthereumSigner.setAccount(ethAccount)
      const chainId = await ledgerLiveAppEthereumSigner.getChainId()
      setEthAccountChainId(chainId)
      _setEthAccount(ethAccount)
    },
    [ledgerLiveAppEthereumSigner]
  )

  // Effect to set the account on the signer whenever the signer or account changes
  useEffect(() => {
    if (ethAccount) {
      setEthAccount(ethAccount)
    }
  }, [ledgerLiveAppEthereumSigner, setEthAccount])

  return (
    <LedgerLiveAppContext.Provider
      value={{
        ethAccount,
        setEthAccount,
        btcAccount,
        setBtcAccount,
        ethAccountChainId,
        ledgerLiveAppEthereumSigner,
      }}
    >
      {children}
    </LedgerLiveAppContext.Provider>
  )
}
