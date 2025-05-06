import { Chains } from "@keep-network/tbtc-v2.ts"
import {
  Layer,
  NetworkType,
  SupportedChainIds,
  AlchemyName,
} from "../enums/networks"

export interface NetworksAlchemyConfig {
  [chainId: number]: {
    name: AlchemyName
    type: NetworkType
  }
}

export interface EthereumRpcMap {
  [chainId: string]: string
}

export type NetworkName = keyof typeof SupportedChainIds
export type MainNetworkName = keyof typeof Chains
export interface Network {
  chainId: SupportedChainIds
  name: Exclude<MainNetworkName, "Solana">
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
    rpcUrls: string[]
    blockExplorerUrls: string[]
  }
  alchemyName?: AlchemyName
}

export type NetworkMapping = Record<number, NetworkName>
