/**
 * Standardized chain name constants with correct casing for all systems
 */

// SDK expected formats (these match what the SDK uses internally)
export const SDK_CHAIN_NAMES = {
  ETHEREUM: "Ethereum",
  SUI: "Sui", // SDK expects "Sui" (title case)
  SOLANA: "Solana",
}

// Our internal formats (for consistency in our codebase)
export enum ChainName {
  ETHEREUM = "ETHEREUM",
  SUI = "SUI",
  SOLANA = "SOLANA",
}

/**
 * Convert our internal chain name format to SDK-expected format
 * @param {string} chainName - Internal chain name (e.g., "SUI")
 * @return {string} SDK-compatible chain name (e.g., "Sui")
 */
export function toSDKChainName(chainName: string): string {
  // Handle case-insensitive matching
  const upperChain = chainName.toUpperCase()

  if (upperChain === ChainName.SUI) {
    return SDK_CHAIN_NAMES.SUI
  } else if (upperChain === ChainName.SOLANA) {
    return SDK_CHAIN_NAMES.SOLANA
  } else if (upperChain === ChainName.ETHEREUM) {
    return SDK_CHAIN_NAMES.ETHEREUM
  }

  // Default fallback (useful for debugging)
  console.warn(`Unknown chain name conversion requested: ${chainName}`)
  return chainName
}
