import { WalletConnectConnector } from "@web3-react/walletconnect-connector"

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: "wss://mainnet.infura.io/ws/v3/33593948cb074eea8e65ae716fc61afd" },
  qrcode: true,
})
