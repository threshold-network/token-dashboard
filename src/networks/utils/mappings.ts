import { Layer, NetworkType } from "../enums/networks"
import { NetworkMapping } from "../types/networks"
import { networks } from "./networks"

export const supportedNetworks: NetworkMapping = {}
export const l1TestNetworks: NetworkMapping = {}
export const l1MainnetNetworks: NetworkMapping = {}
export const l2TestNetworks: NetworkMapping = {}
export const l2MainnetNetworks: NetworkMapping = {}
export const testNetworks: NetworkMapping = {}

networks.forEach((network) => {
  const { chainId, name, layer, networkType } = network
  supportedNetworks[chainId] = name

  if (layer === Layer.L1 && networkType === NetworkType.Testnet) {
    l1TestNetworks[chainId] = name
  }

  if (layer === Layer.L1 && networkType === NetworkType.Mainnet) {
    l1MainnetNetworks[chainId] = name
  }

  if (layer === Layer.L2 && networkType === NetworkType.Testnet) {
    l2TestNetworks[chainId] = name
  }

  if (layer === Layer.L2 && networkType === NetworkType.Mainnet) {
    l2MainnetNetworks[chainId] = name
  }

  if (networkType === NetworkType.Testnet) {
    testNetworks[chainId] = name
  }
})
