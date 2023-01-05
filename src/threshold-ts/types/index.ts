import { Client } from "@keep-network/tbtc-v2.ts/dist/bitcoin"
import { Credentials } from "@keep-network/tbtc-v2.ts/dist/electrum"
import { providers, Signer } from "ethers"

export interface EthereumConfig {
  providerOrSigner: providers.Provider | Signer
  chainId: string | number
  account?: string
}

export interface BitcoinConfig {
  // TODO: electrum credentials

  /**
   * If we want to mock client then we should pass the mock here
   */
  client?: Client

  /**
   * Credentials for electrum client
   */
  credentials?: Credentials
}

export interface ThresholdConfig {
  ethereum: EthereumConfig
  bitcoin: BitcoinConfig
}
