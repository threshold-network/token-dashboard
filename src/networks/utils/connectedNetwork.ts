import { getChainIdToNetworkName } from "./getChainIdToNetworkName"
import {
  l1MainnetNetworksMap,
  l1TestNetworksMap,
  l2MainnetNetworksMap,
  l2TestNetworksMap,
  testNetworksMap,
} from "./mappings"

export const isSupportedNetwork = (chainId?: string | number): boolean => {
  return getChainIdToNetworkName(chainId) !== "Unsupported"
}

export const isTestnetNetwork = (networkChainId: string | number): boolean => {
  return !!testNetworksMap[Number(networkChainId)]
}

export const isL2Network = (networkChainId?: string | number): boolean => {
  const chainId = Number(networkChainId)
  return !!l2MainnetNetworksMap[chainId] || !!l2TestNetworksMap[chainId]
}

export const isL1Network = (networkChainId?: string | number): boolean => {
  const chainId = Number(networkChainId)
  return !!l1MainnetNetworksMap[chainId] || !!l1TestNetworksMap[chainId]
}

export const isL1Mainnet = (networkChainId?: string | number): boolean => {
  const chainId = Number(networkChainId)
  return !!l1MainnetNetworksMap[chainId]
}
