/**
 * StarkNet Configuration
 *
 * This file contains all StarkNet-specific configuration including
 * network endpoints, contract addresses, and relayer URLs.
 */

/**
 * SINGLE CONTROL POINT FOR STARKNET NETWORKS
 * Comment out any network here to disable it throughout the application
 */
export const ENABLED_STARKNET_NETWORKS = {
  mainnet: true,
  sepolia: true, // Set to false or comment out to disable StarkNet Sepolia
} as const

export interface StarkNetNetworkConfig {
  chainId: string
  chainName: string
  l1BitcoinDepositorAddress: string
  relayerUrl: string
  explorerUrl: string
  isTestnet: boolean
}

/**
 * StarkNet network configurations
 * These are hardcoded values for each network environment
 */
export const STARKNET_NETWORK_CONFIGS: Record<
  "sepolia" | "mainnet",
  StarkNetNetworkConfig
> = {
  sepolia: {
    chainId: "0x534e5f5345504f4c4941", // "SN_SEPOLIA" in hex
    chainName: "StarkNet Sepolia",
    l1BitcoinDepositorAddress: "0x9Ee0F52fDe7dEf063450fD128c0686e169d3b3D3",
    relayerUrl: "https://sepolia-relayer.threshold.network",
    explorerUrl: "https://sepolia.starkscan.co",
    isTestnet: true,
  },
  mainnet: {
    chainId: "0x534e5f4d41494e", // "SN_MAIN" in hex
    chainName: "StarkNet",
    l1BitcoinDepositorAddress: "0xCA897c4a52afB48A923C6a3E08d47193893B1ba9",
    relayerUrl: "https://relayer.threshold.network",
    explorerUrl: "https://starkscan.co",
    isTestnet: false,
  },
}

// Export chain IDs for easy access (only if enabled)
export const STARKNET_MAINNET_CHAIN_ID = ENABLED_STARKNET_NETWORKS.mainnet
  ? STARKNET_NETWORK_CONFIGS.mainnet.chainId
  : undefined
export const STARKNET_SEPOLIA_CHAIN_ID = ENABLED_STARKNET_NETWORKS.sepolia
  ? STARKNET_NETWORK_CONFIGS.sepolia.chainId
  : undefined

/**
 * Helper function to check if a StarkNet network is enabled
 * @param {"mainnet"|"sepolia"} network - The network to check
 * @return {boolean} True if the network is enabled, false otherwise
 */
export function isStarkNetNetworkEnabled(
  network: "mainnet" | "sepolia"
): boolean {
  return ENABLED_STARKNET_NETWORKS[network] === true
}

/**
 * Get all enabled StarkNet chain IDs
 * @return {string[]} Array of enabled StarkNet chain IDs
 */
export function getEnabledStarkNetChainIds(): string[] {
  const chainIds: string[] = []
  if (ENABLED_STARKNET_NETWORKS.mainnet) {
    chainIds.push(STARKNET_NETWORK_CONFIGS.mainnet.chainId)
  }
  if (ENABLED_STARKNET_NETWORKS.sepolia) {
    chainIds.push(STARKNET_NETWORK_CONFIGS.sepolia.chainId)
  }
  return chainIds
}

/**
 * Check if a chain ID belongs to an enabled StarkNet network
 * @param {string|number} chainId - The chain ID to check
 * @return {boolean} True if the chain ID belongs to an enabled network, false otherwise
 */
export function isEnabledStarkNetChainId(chainId?: string | number): boolean {
  if (!chainId) return false

  const chainIdStr =
    typeof chainId === "string"
      ? chainId.toLowerCase()
      : chainId.toString(16).toLowerCase()

  const enabledChainIds = getEnabledStarkNetChainIds().map((id) =>
    id.toLowerCase()
  )
  return enabledChainIds.some(
    (enabledId) =>
      chainIdStr === enabledId || chainIdStr === enabledId.replace("0x", "")
  )
}

/**
 * Get the appropriate StarkNet configuration based on chain ID
 * @param {string|number} chainId - The StarkNet chain ID (optional)
 * @return {StarkNetNetworkConfig} The network configuration
 */
export function getStarkNetNetworkConfig(
  chainId?: string | number
): StarkNetNetworkConfig {
  if (chainId) {
    const chainIdStr =
      typeof chainId === "string"
        ? chainId.toLowerCase()
        : chainId.toString(16).toLowerCase()

    // Check if it's mainnet
    const isMainnet =
      chainIdStr === STARKNET_MAINNET_CHAIN_ID?.toLowerCase() ||
      chainIdStr === STARKNET_MAINNET_CHAIN_ID?.toLowerCase().replace("0x", "")

    // Return mainnet if enabled and matched
    if (isMainnet && ENABLED_STARKNET_NETWORKS.mainnet) {
      return STARKNET_NETWORK_CONFIGS.mainnet
    }

    // Check if it's sepolia
    const isSepolia =
      chainIdStr === STARKNET_SEPOLIA_CHAIN_ID?.toLowerCase() ||
      chainIdStr === STARKNET_SEPOLIA_CHAIN_ID?.toLowerCase().replace("0x", "")

    // Return sepolia if enabled and matched
    if (isSepolia && ENABLED_STARKNET_NETWORKS.sepolia) {
      return STARKNET_NETWORK_CONFIGS.sepolia
    }
  }

  // Default to the first enabled network
  if (ENABLED_STARKNET_NETWORKS.mainnet) {
    return STARKNET_NETWORK_CONFIGS.mainnet
  }
  if (ENABLED_STARKNET_NETWORKS.sepolia) {
    return STARKNET_NETWORK_CONFIGS.sepolia
  }

  // This should not happen if at least one network is enabled
  throw new Error("No StarkNet networks are enabled")
}
