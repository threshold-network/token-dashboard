export enum ChainID {
  Ethereum = 1,
  Ropsten = 3,
}

export enum LedgerConnectionStage {
  SelectDerivation = "SELECT_DERIVATION",
  LoadAddresses = "LOAD_ADDRESSES",
  SelectAddress = "SELECT_ADDRESS",
  ConfirmSelected = "CONFIRM_SELECTED",
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
