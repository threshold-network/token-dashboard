import { providers, Signer } from "ethers"

export interface EthereumConfig {
  providerOrSigner: providers.Provider | Signer
  chainId: string | number
  account?: string
}

export interface ThresholdConfig {
  ethereum: EthereumConfig
  // TODO: Define the bitcoin config for the tbtc v2 lib.
  // bitcoin: {}
}
