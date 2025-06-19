import {
  BitcoinClient,
  BitcoinNetwork,
  ElectrumClientOptions,
  ElectrumCredentials,
} from "@keep-network/tbtc-v2.ts"
import { providers, Signer } from "ethers"

export type CrossChainConfig = {
  isCrossChain: boolean
  chainName: ChainName | null
  nonEVMProvider: any | null
}

export enum ChainName {
  Ethereum = "Ethereum", // can be any l2 based on Ethereum network as such as arbitrum, optimism, etc.
  Solana = "Solana",
  Starknet = "StarkNet",
}

export interface EthereumConfig {
  ethereumProviderOrSigner: providers.Provider | Signer
  chainId: string | number
  shouldUseTestnetDevelopmentContracts: boolean
  account?: string
}

export type BitcoinClientCredentials = ElectrumCredentials

export type BitcoinClientOptions = ElectrumClientOptions

export interface BitcoinConfig {
  /**
   * Indicates for which network the addresses (eg deposit address) should be
   * encoded for. Also is used to validate the user input on the dapp.
   * For example "mainnet" or "testnet"
   */
  network: BitcoinNetwork

  /**
   * If we want to mock client then we should pass the mock here
   */
  client?: BitcoinClient

  /**
   * Credentials for electrum client
   */
  credentials?: BitcoinClientCredentials[]

  /**
   * Additional options that can be passed to bitcoin client
   */
  clientOptions?: BitcoinClientOptions
}

export interface ThresholdConfig {
  ethereum: EthereumConfig
  bitcoin: BitcoinConfig
  crossChain: CrossChainConfig
}

export { BitcoinNetwork }
