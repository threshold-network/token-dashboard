import { getChainIdToNetworkName } from "./getChainIdToNetworkName"
import {
  l1MainnetNetworks,
  l1TestNetworks,
  l2MainnetNetworks,
  l2TestNetworks,
  mainNetworks,
  testNetworks,
} from "./mappings"
import { hexToNumber, compareChainIds } from "./chainId"
import { SupportedChainIds } from "../enums/networks"
import { networks } from "./networks"
import { Network } from "../types/networks"
import { isEnabledStarkNetChainId } from "../../config/starknet"

export const isSupportedNetwork = (chainId?: string | number): boolean => {
  return getChainIdToNetworkName(chainId) !== "Unsupported"
}

export const isTestnetChainId = (networkChainId: string | number): boolean => {
  return !!testNetworks[hexToNumber(networkChainId)]
}

export const isMainnetChainId = (networkChainId: string | number): boolean => {
  return !!mainNetworks[hexToNumber(networkChainId)]
}

export const isL2Network = (networkChainId?: string | number): boolean => {
  if (!networkChainId) return false

  // Check StarkNet first (with enhanced comparison for large hex values)
  if (isStarknetNetwork(networkChainId)) return true

  // Check other L2 networks
  const chainId = hexToNumber(networkChainId)
  return !!l2MainnetNetworks[chainId] || !!l2TestNetworks[chainId]
}

export const isL1Network = (networkChainId?: string | number): boolean => {
  if (!networkChainId) return false
  const chainId = hexToNumber(networkChainId)
  return !!l1MainnetNetworks[chainId] || !!l1TestNetworks[chainId]
}

export const isL1Mainnet = (networkChainId?: string | number): boolean => {
  if (!networkChainId) return false
  const chainId = hexToNumber(networkChainId)
  return !!l1MainnetNetworks[chainId]
}

export const isStarknetNetwork = (
  networkChainId?: string | number | null
): boolean => {
  if (!networkChainId) return false
  // Use the centralized configuration to check if this is an enabled StarkNet network
  return isEnabledStarkNetChainId(networkChainId)
}

export const getChainIdToL2Chain = (
  networkChainId?: string | number
): string | null => {
  if (!networkChainId) return null

  // Handle StarkNet chains using centralized configuration
  if (isEnabledStarkNetChainId(networkChainId)) {
    return "StarkNet"
  }

  const chainId = hexToNumber(networkChainId)

  // Other L2 chains
  if (chainId === SupportedChainIds.Arbitrum) {
    return "Arbitrum"
  }

  if (chainId === SupportedChainIds.Base) {
    return "Base"
  }

  // Return null for L1 chains
  return null
}

export const getNetworkFromChainId = (
  chainId?: string | number
): Network | null => {
  if (!chainId) return null

  // Find network using enhanced comparison for StarkNet compatibility
  return (
    networks.find((network) => compareChainIds(network.chainId, chainId)) ||
    null
  )
}
