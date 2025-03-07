import { getChainIdToNetworkName } from "./getChainIdToNetworkName"
import {
  l1MainnetNetworks,
  l1TestNetworks,
  l2MainnetNetworks,
  l2TestNetworks,
  mainNetworks,
  testNetworks,
} from "./mappings"

export const isSupportedNetwork = (chainId?: string | number): boolean => {
  return getChainIdToNetworkName(chainId) !== "Unsupported"
}

export const isTestnetChainId = (networkChainId: string | number): boolean => {
  return !!testNetworks[Number(networkChainId)]
}

export const isMainnetChainId = (networkChainId: string | number): boolean => {
  return !!mainNetworks[Number(networkChainId)]
}

export const isL2Network = (networkChainId?: string | number): boolean => {
  const chainId = Number(networkChainId)
  return !!l2MainnetNetworks[chainId] || !!l2TestNetworks[chainId]
}

export const isL1Network = (networkChainId?: string | number): boolean => {
  const chainId = Number(networkChainId)
  return !!l1MainnetNetworks[chainId] || !!l1TestNetworks[chainId]
}

export const isL1Mainnet = (networkChainId?: string | number): boolean => {
  const chainId = Number(networkChainId)
  return !!l1MainnetNetworks[chainId]
}
