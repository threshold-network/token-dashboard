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
export interface Network {
  chainId: SupportedChainIds
  name: keyof typeof Chains | "StarkNet"
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
