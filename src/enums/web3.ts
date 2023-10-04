export enum ChainID {
  Ethereum = 1,
  Goerli = 5,
  Localhost = 1337,
  Base = 8453,
  BaseTestnet = 84531,
}

export enum ConnectionError {
  MetamaskNotInstalled = "No Ethereum provider was found on window.ethereum",
  RejectedMetamaskConnection = "The user rejected the request.",
  RejectedCoinbaseConnection = "User denied account authorization",
  CoinbaseUnsupportedNetwork = "Unsupported chain id:",
}

export enum WalletType {
  TAHO = "TAHO",
  Metamask = "METAMASK",
  WalletConnect = "WALLET_CONNECT",
  Coinbase = "COINBASE",
  LedgerLive = "LEDGER_LIVE",
}
