import { WalletType } from "../../enums"
import {
  AbstractConnector,
  CoinbaseWalletConnector,
  LedgerLiveConnector,
  MetaMask,
  WalletConnectConnector,
} from "../connectors"

export const getWalletTypeFromConnector = (
  connector: AbstractConnector | undefined
): WalletType | undefined => {
  if (connector instanceof MetaMask) {
    const isMetamask = connector.isMetaMask(window.ethereum)
    return isMetamask ? WalletType.Metamask : WalletType.TAHO
  }

  if (connector instanceof LedgerLiveConnector) return WalletType.LedgerLive

  if (connector instanceof WalletConnectConnector)
    return WalletType.WalletConnect

  if (connector instanceof CoinbaseWalletConnector) return WalletType.Coinbase

  return undefined
}
