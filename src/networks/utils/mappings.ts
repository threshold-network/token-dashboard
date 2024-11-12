import { Layer, NetworkType } from "../enums/networks"
import { NetworkMapping } from "../types/networks"
import { networks } from "./networks"

export const supportedNetworksMap: NetworkMapping = {}
export const l1TestNetworksMap: NetworkMapping = {}
export const l1MainnetNetworksMap: NetworkMapping = {}
export const l2TestNetworksMap: NetworkMapping = {}
export const l2MainnetNetworksMap: NetworkMapping = {}
export const testNetworksMap: NetworkMapping = {}

networks.forEach((network) => {
  const { chainId, name, layer, networkType } = network
  supportedNetworksMap[chainId] = name

  if (layer === Layer.L1 && networkType === NetworkType.Testnet) {
    l1TestNetworksMap[chainId] = name
  }

  if (layer === Layer.L1 && networkType === NetworkType.Mainnet) {
    l1MainnetNetworksMap[chainId] = name
  }

  if (layer === Layer.L2 && networkType === NetworkType.Testnet) {
    l2TestNetworksMap[chainId] = name
  }

  if (layer === Layer.L2 && networkType === NetworkType.Mainnet) {
    l2MainnetNetworksMap[chainId] = name
  }

  if (networkType === NetworkType.Testnet) {
    testNetworksMap[chainId] = name
  }
})
