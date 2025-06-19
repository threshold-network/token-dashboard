import { ITBTC } from "../threshold-ts/tbtc"
import {
  getStarkNetNetworkConfig,
  STARKNET_MAINNET_CHAIN_ID,
  STARKNET_SEPOLIA_CHAIN_ID,
  isEnabledStarkNetChainId,
} from "../config/starknet"

// Re-export StarkNet configuration types and helpers
export type { StarkNetNetworkConfig as StarkNetConfig } from "../config/starknet"
export { STARKNET_MAINNET_CHAIN_ID, STARKNET_SEPOLIA_CHAIN_ID }

// Export STARKNET_CONFIGS for backward compatibility
import { STARKNET_NETWORK_CONFIGS } from "../config/starknet"
export const STARKNET_CONFIGS = STARKNET_NETWORK_CONFIGS

// Helper to get current StarkNet configuration
// This is a wrapper around the config function for backward compatibility
export function getStarkNetConfig(chainId?: string | number) {
  return getStarkNetNetworkConfig(chainId)
}

// StarkNet address validation
export const isValidStarkNetAddress = (address?: string): boolean => {
  if (!address) return false

  // Basic validation for StarkNet address format
  if (!address.startsWith("0x") && !address.startsWith("0X")) return false

  // Remove 0x prefix and check if it's a valid hex string
  const hexPart = address.slice(2)
  if (!/^[0-9a-fA-F]+$/.test(hexPart)) return false

  // StarkNet addresses should be at least 40 characters (20 bytes) to be valid
  // This prevents very short strings like "0x123" from being considered valid
  if (hexPart.length < 40 || hexPart.length > 64) return false

  return true
}

// Get StarkNet deposit owner address
export const getStarkNetDepositOwner = (tbtc?: ITBTC): string | undefined => {
  // This function may need to be updated once we have access to the SDK's crossChain internals
  // For now, we can't directly access the deposit owner from the TBTC instance
  return undefined
}

// Network compatibility check - enhanced with config awareness
export const checkStarkNetNetworkCompatibility = (
  evmChainId?: number,
  starkNetChainId?: string | number
): { compatible: boolean; error?: string } => {
  if (!evmChainId || !starkNetChainId) {
    return { compatible: false, error: "Network information missing" }
  }

  // First check if the StarkNet network is enabled
  if (!isEnabledStarkNetChainId(starkNetChainId)) {
    return {
      compatible: false,
      error:
        "The connected StarkNet network is not enabled. Please switch to a supported network in your wallet.",
    }
  }

  const config = getStarkNetConfig(starkNetChainId)

  // Check if both networks are mainnet or both are testnet
  const isEvmTestnet = [11155111, 5].includes(evmChainId) // Sepolia, Goerli
  const isStarkNetTestnet = config.isTestnet

  // For StarkNet chain ID comparison, handle both hex strings and our converted numbers
  const starkNetChainIdStr =
    typeof starkNetChainId === "string"
      ? starkNetChainId.toLowerCase()
      : starkNetChainId.toString(16).toLowerCase()

  const expectedChainId = config.chainId.toLowerCase()
  const isCorrectStarkNetChain =
    starkNetChainIdStr === expectedChainId ||
    starkNetChainIdStr === expectedChainId.replace("0x", "")

  if (!isCorrectStarkNetChain) {
    return {
      compatible: false,
      error: `Wrong StarkNet network. Please switch to ${config.chainName} in your wallet.`,
    }
  }

  if (isEvmTestnet !== isStarkNetTestnet) {
    return {
      compatible: false,
      error: `Network mismatch: EVM is on ${
        isEvmTestnet ? "testnet" : "mainnet"
      }, StarkNet is on ${isStarkNetTestnet ? "testnet" : "mainnet"}`,
    }
  }

  return { compatible: true }
}

// Error message formatter for StarkNet-specific errors
export const formatStarkNetError = (error: Error): string => {
  const message = error.message.toLowerCase()

  if (message.includes("timeout")) {
    return "Request timed out. Please try again."
  }

  if (message.includes("rejected") || message.includes("denied")) {
    return "Transaction rejected by user."
  }

  if (message.includes("insufficient")) {
    return "Insufficient balance for transaction."
  }

  if (message.includes("network")) {
    return "Network connection error. Please check your connection and try again."
  }

  if (message.includes("relayer")) {
    return "Relayer service temporarily unavailable. Please try again later."
  }

  if (message.includes("invalid address")) {
    return "Invalid StarkNet address format."
  }

  // Return original message if no specific formatting applies
  return error.message
}
