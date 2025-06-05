import { ITBTC } from "../threshold-ts/tbtc"
import { isStarknetNetwork } from "../networks/utils/connectedNetwork"
import {
  StarkNetProvider,
  StarkNetDepositConfig,
  isStarkNetChainId,
  STARKNET_MAINNET_CHAIN_ID,
  STARKNET_SEPOLIA_CHAIN_ID,
} from "../types/starknet"

// Re-export isStarknetNetwork for convenience
export { isStarknetNetwork }

// StarkNet Configuration Interface
export interface StarkNetConfig {
  chainId: string
  chainName: string
  l1BitcoinDepositorAddress: string
  relayerUrl: string
  explorerUrl: string
  isTestnet: boolean
}

// StarkNet Configuration Constants - base configs without env vars
export const STARKNET_CONFIGS: Record<
  "sepolia" | "mainnet",
  Omit<StarkNetConfig, "relayerUrl">
> = {
  sepolia: {
    chainId: "0x534e5f5345504f4c4941",
    chainName: "StarkNet Sepolia",
    l1BitcoinDepositorAddress: "0x9Ee0F52fDe7dEf063450fD128c0686e169d3b3D3", // TODO: Replace with actual Sepolia address from SDK deployments
    explorerUrl: "https://sepolia.starkscan.co",
    isTestnet: true,
  },
  mainnet: {
    chainId: "0x534e5f4d41494e",
    chainName: "StarkNet",
    l1BitcoinDepositorAddress: "0xCA897c4a52afB48A923C6a3E08d47193893B1ba9", // TODO: Replace with actual mainnet address from SDK deployments
    explorerUrl: "https://starkscan.co",
    isTestnet: false,
  },
}

// Helper to get current StarkNet configuration
export function getStarkNetConfig(chainId?: string | number): StarkNetConfig {
  // If chainId is provided, use it to determine the network
  if (chainId) {
    const chainIdStr =
      typeof chainId === "string"
        ? chainId.toLowerCase()
        : chainId.toString(16).toLowerCase()
    const isMainnet =
      chainIdStr === STARKNET_MAINNET_CHAIN_ID.toLowerCase() ||
      chainIdStr === STARKNET_MAINNET_CHAIN_ID.toLowerCase().replace("0x", "")

    const baseConfig = STARKNET_CONFIGS[isMainnet ? "mainnet" : "sepolia"]

    // Add the relayer URL with environment variable override
    const relayerUrl = isMainnet
      ? process.env.REACT_APP_STARKNET_MAINNET_RELAYER_URL ||
        "https://relayer.threshold.network"
      : process.env.REACT_APP_STARKNET_SEPOLIA_RELAYER_URL ||
        "https://sepolia-relayer.threshold.network"

    return {
      ...baseConfig,
      relayerUrl,
    }
  }

  // Fallback to environment variable if no chainId provided
  const useMainnet = process.env.REACT_APP_STARKNET_MAINNET === "true"
  const baseConfig = STARKNET_CONFIGS[useMainnet ? "mainnet" : "sepolia"]

  // Add the relayer URL with environment variable override
  const relayerUrl = useMainnet
    ? process.env.REACT_APP_STARKNET_MAINNET_RELAYER_URL ||
      "https://relayer.threshold.network"
    : process.env.REACT_APP_STARKNET_SEPOLIA_RELAYER_URL ||
      "https://sepolia-relayer.threshold.network"

  return {
    ...baseConfig,
    relayerUrl,
  }
}

// StarkNet address validation
export const isValidStarkNetAddress = (address?: string): boolean => {
  if (!address) return false

  // Basic validation for StarkNet address format
  if (!address.startsWith("0x") && !address.startsWith("0X")) return false

  // Remove 0x prefix and check if it's a valid hex string
  const hexPart = address.slice(2)
  if (!/^[0-9a-fA-F]+$/.test(hexPart)) return false

  // StarkNet addresses can be up to 64 characters (32 bytes) but typically shorter
  if (hexPart.length > 64) return false

  return true
}

// Check if StarkNet cross-chain is properly initialized
export const isStarkNetInitialized = (
  tbtc?: ITBTC,
  chainId?: string | number
): boolean => {
  if (!tbtc || !chainId) return false

  if (!isStarknetNetwork(chainId)) return false

  try {
    // Check if cross-chain is enabled for this TBTC instance
    // Since crossChain isn't directly exposed, we check if it's a cross-chain instance
    // and if we're on a StarkNet network
    return tbtc.isCrossChain && isStarknetNetwork(chainId)
  } catch {
    return false
  }
}

// Get StarkNet deposit owner address
export const getStarkNetDepositOwner = (tbtc?: ITBTC): string | undefined => {
  // This function may need to be updated once we have access to the SDK's crossChain internals
  // For now, we can't directly access the deposit owner from the TBTC instance
  return undefined
}

// Initialize StarkNet deposit with proper configuration
export const initializeStarkNetDeposit = async (
  tbtc: ITBTC,
  starkNetAddress: string,
  btcRecoveryAddress: string,
  chainId?: string | number
) => {
  if (!isValidStarkNetAddress(starkNetAddress)) {
    throw new Error("Invalid StarkNet address format")
  }

  if (!tbtc.isCrossChain) {
    throw new Error(
      "StarkNet cross-chain not initialized. Please connect your StarkNet wallet first."
    )
  }

  try {
    const config = getStarkNetConfig(chainId)

    // Log configuration being used
    console.log(`Initializing StarkNet deposit on ${config.chainName}`)

    // For StarkNet cross-chain deposits, we pass the L2 chain name directly
    // The SDK expects the chain name as a string, not a numeric chain ID
    const deposit = await tbtc.initiateCrossChainDepositWithChainName(
      btcRecoveryAddress,
      "StarkNet" // L2 chain name expected by SDK
    )

    return deposit
  } catch (error) {
    // Provide user-friendly error messages
    if (error instanceof Error) {
      if (
        error.message.includes("timeout") ||
        error.message.includes("network")
      ) {
        throw new Error("Network request timed out. Please try again.")
      }
      if (
        error.message.includes("unauthorized") ||
        error.message.includes("auth")
      ) {
        throw new Error("Authentication failed. Please reconnect your wallet.")
      }
      if (error.message.includes("relayer")) {
        throw new Error(
          "Relayer service is temporarily unavailable. Please try again later."
        )
      }
    }

    throw error
  }
}

// Network compatibility check - enhanced with config awareness
export const checkStarkNetNetworkCompatibility = (
  evmChainId?: number,
  starkNetChainId?: string | number
): { compatible: boolean; error?: string } => {
  if (!evmChainId || !starkNetChainId) {
    return { compatible: false, error: "Network information missing" }
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
