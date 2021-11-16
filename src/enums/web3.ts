export enum ChainID {
  Ethereum = 1,
  Ropsten = 3,
  Localhost = 1337,
}

export enum LedgerConnectionStage {
  SelectDerivation = "SELECT_DERIVATION",
  SelectAddress = "SELECT_ADDRESS",
  ConfirmSuccess = "CONFIRM_SUCCESS",
}

export enum ConnectionError {
  metamaskNotInstalled = "No Ethereum provider was found on window.ethereum",
  rejectedConnection = "The user rejected the request.",
}

export enum WalletType {
  Metamask = "METAMASK",
  Ledger = "LEDGER",
  WalletConnect = "WALLET_CONNECT",
}
