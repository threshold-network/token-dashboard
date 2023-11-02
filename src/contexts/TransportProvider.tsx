import { WalletAPIProvider } from "@ledgerhq/wallet-api-client-react"
import { Transport, WindowMessageTransport } from "@ledgerhq/wallet-api-client"
import { FC } from "react"

const TransportProvider: FC = ({ children }) => {
  const getWalletAPITransport = (): Transport => {
    if (typeof window === "undefined") {
      return {
        onMessage: undefined,
        send: () => {},
      }
    }

    const transport = new WindowMessageTransport()
    transport.connect()
    return transport
  }

  const transport = getWalletAPITransport()

  return <WalletAPIProvider transport={transport}>{children}</WalletAPIProvider>
}

export default TransportProvider
