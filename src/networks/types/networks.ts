import {
  Layer,
  NetworkType,
  SupportedChainIds,
  AlchemyNetworkId,
  InfuraNetworkId,
  NetworksName,
} from "../enums/networks"
export interface RpcServiceConfig {
  networkId?: AlchemyNetworkId | InfuraNetworkId
  networkType: NetworkType
}

export interface EthereumRpcMap {
  [chainId: string]: string
}

export type NetworkName = keyof typeof SupportedChainIds
export interface Network {
  chainId: SupportedChainIds
  name: NetworksName
  layer: Layer
  networkType: NetworkType
  chainParameters: {
    chainId: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    blockExplorerUrls: string[]
  }
  rpcNetworkId?: AlchemyNetworkId | InfuraNetworkId
}

export type TrmNetworksMap = {
  [chainId: number]: string
}

export type NetworkMapping = Record<number, NetworkName>
