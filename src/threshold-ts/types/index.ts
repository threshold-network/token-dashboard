import {
  BitcoinClient,
  BitcoinNetwork,
  ElectrumClientOptions,
  ElectrumCredentials,
} from "@keep-network/tbtc-v2.ts"
import { providers, Signer } from "ethers"

export interface EthereumConfig {
  providerOrSigner: providers.Provider | Signer
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
}

export { BitcoinNetwork }
