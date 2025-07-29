export enum TrmNetworksChainId {
  ethereum = 1,
  arbitrum = 42161,
  base = 8453,
}

export enum SupportedChainIds {
  Ethereum = 1,
  Sepolia = 11155111,
  Localhost = 1337,
  Arbitrum = 42161,
  Base = 8453,
  Bob = 60808,
  BobSepolia = 808813,
  ArbitrumSepolia = 421614,
  BaseSepolia = 84532,
}

export enum NonEVMNetworks {
  Solana = "Solana",
  StarkNet = "StarkNet",
  Sui = "Sui",
}

export enum AlchemyName {
  Ethereum = "eth",
  Arbitrum = "arb",
  Base = "base",
}

export enum NetworkType {
  Mainnet = "mainnet",
  Testnet = "sepolia",
}

export enum Layer {
  L1 = "L1",
  L2 = "L2",
}

export enum NativeCurrency {
  Ether = "Ether",
  SepoliaEther = "Sepolia Ether",
}

export enum ExplorerDataType {
  TRANSACTION = "transaction",
  TOKEN = "token",
  ADDRESS = "address",
  BLOCK = "block",
}

export enum PublicRpcUrls {
  Ethereum = "https://eth.drpc.org",
  Sepolia = "https://sepolia.drpc.org",
  Localhost = "http://localhost:8545",
  Arbitrum = "https://arbitrum.drpc.org",
  ArbitrumSepolia = "https://arbitrum-sepolia.drpc.org",
  Base = "https://base.drpc.org",
  BaseSepolia = "https://base-sepolia.drpc.org",
  Bob = "https://rpc.gobob.xyz/",
  BobSepolia = "https://bob-sepolia.rpc.gobob.xyz/",
}
