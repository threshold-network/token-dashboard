// StarkNet-specific deposit configuration
export interface StarkNetDepositConfig {
  l2DepositOwner: string // StarkNet address receiving tBTC
  btcRecoveryAddress: string // Bitcoin address for recovery
  chainId: string // StarkNet chain ID
  relayerUrl?: string // Optional custom relayer URL
}

// StarkNet provider interface (simplified)
export interface StarkNetProvider {
  account?: {
    address: string
  }
  address?: string // Alternative provider structure
  selectedAddress?: string // Another alternative
  getChainId?: () => Promise<string>
  request?: (request: { type: string; params?: any }) => Promise<any>
}
// StarkNet network constants
export const STARKNET_MAINNET_CHAIN_ID = "0x534e5f4d41494e"
export const STARKNET_SEPOLIA_CHAIN_ID = "0x534e5f5345504f4c4941"

// StarkNet configuration defaults (RPC and explorer URLs only)
export const STARKNET_DEFAULTS = {
  mainnet: {
    rpcUrl: "https://starknet-mainnet.public.blastapi.io",
    explorerUrl: "https://starkscan.co",
  },
  testnet: {
    rpcUrl: "https://starknet-sepolia.public.blastapi.io",
    explorerUrl: "https://sepolia.starkscan.co",
  },
}

export default {
  STARKNET_MAINNET_CHAIN_ID,
  STARKNET_SEPOLIA_CHAIN_ID,
  STARKNET_DEFAULTS,
}
