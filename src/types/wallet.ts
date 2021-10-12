export enum LedgerConnectionStage {
  SELECT_DERIVATION = "SELECT_DERIVATION",
  SELECT_ADDRESS = "SELECT_ADDRESS",
  CONFIRM_CONNECTED = "CONFIRM_CONNECTED",
}

export enum ConnectionError {
  metamaskNotInstalled = "No Ethereum provider was found on window.ethereum",
  rejectedConnection = "The user rejected the request.",
}

export interface WalletConnectionModalProps {
  goBack: () => void
  closeModal: () => void
}
