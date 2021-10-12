import { WalletConnectConnector } from "@web3-react/walletconnect-connector"
import { RPC_URL } from "../../config"

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URL[1] },
  qrcode: true,
})
