import { WalletAPIProvider } from "@ledgerhq/wallet-api-client-react"
import { WindowMessageTransport } from "@ledgerhq/wallet-api-client"
import { createContext, FC, useContext } from "react"

const getWalletAPITransport = (): WindowMessageTransport => {
  const transport = new WindowMessageTransport()
  return transport
}

export const walletApiReactTransport = getWalletAPITransport()

interface TransportContextState {
  walletApiReactTransport: WindowMessageTransport
}

export const useWalletApiReactTransport = () => {
  return useContext(WalletApiReactTransportContext)
}

const WalletApiReactTransportContext = createContext<TransportContextState>({
  walletApiReactTransport: walletApiReactTransport,
})

export const WalletApiReactTransportProvider: React.FC = ({ children }) => {
  return (
    <WalletApiReactTransportContext.Provider
      value={{
        walletApiReactTransport,
      }}
    >
      {children}
    </WalletApiReactTransportContext.Provider>
  )
}

const TransportProvider: FC = ({ children }) => {
  return (
    <WalletAPIProvider transport={walletApiReactTransport}>
      <WalletApiReactTransportProvider>
        {children}
      </WalletApiReactTransportProvider>
    </WalletAPIProvider>
  )
}

export default TransportProvider
