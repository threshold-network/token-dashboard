import { SupportedChainIds } from "../enums/networks"

export const DECIMALS = 18
export const ETH_SYMBOL = "ETH"
export const MAIN_ALCHEMY_URL = "g.alchemy.com/v2/"
export const MAIN_INFURA_URL = "infura.io/v3/"

export const publicRpcUrls: Record<SupportedChainIds, string> = {
  [SupportedChainIds.Ethereum]: "https://eth.drpc.org",
  [SupportedChainIds.Sepolia]: "https://sepolia.drpc.org",
  [SupportedChainIds.Localhost]: "http://localhost:8545",
  [SupportedChainIds.Arbitrum]: "https://arbitrum.drpc.org",
  [SupportedChainIds.ArbitrumSepolia]: "https://arbitrum-sepolia.drpc.org",
  [SupportedChainIds.Base]: "https://base.drpc.org",
  [SupportedChainIds.BaseSepolia]: "https://base-sepolia.drpc.org",
}
