import { JsonRpcProvider, Provider } from "@ethersproject/providers"
import { Signer } from "ethers"
import { Threshold } from "../threshold-ts"
import { ChainID, EnvVariable } from "../enums"
import { getEnvVariable, supportedChainId } from "../utils/getEnvVariable"
import { MockBitcoinClient } from "../tbtc/mock-bitcoin-client"
import {
  BitcoinConfig,
  BitcoinNetwork,
  BitcoinClientCredentials,
  EthereumConfig,
} from "../threshold-ts/types"

function getInitialEthereumConfig(
  providerOrSigner?: Provider | Signer
): EthereumConfig {
  const useGoerliDevelopmentContractsFlag =
    getEnvVariable(EnvVariable.USE_GOERLI_DEVELOPMENT_CONTRACTS) === "true"
  return {
    chainId: supportedChainId,
    providerOrSigner: providerOrSigner || getDefaultThresholdLibProvider(),
    shouldUseGoerliDevelopmentContracts:
      supportedChainId === ChainID.Goerli.toString() &&
      useGoerliDevelopmentContractsFlag,
  }
}

function getInitialBitcoinConfig(): BitcoinConfig {
  const network =
    supportedChainId === ChainID.Ethereum.toString()
      ? BitcoinNetwork.Mainnet
      : BitcoinNetwork.Testnet

  const shouldMockBitcoinClient =
    getEnvVariable(EnvVariable.MOCK_BITCOIN_CLIENT) === "true"

  const credentials: BitcoinClientCredentials[] = [
    {
      host: getEnvVariable(EnvVariable.ELECTRUM_HOST),
      port: +getEnvVariable(EnvVariable.ELECTRUM_PORT),
      protocol: getEnvVariable(
        EnvVariable.ELECTRUM_PROTOCOL
      ) as BitcoinClientCredentials["protocol"],
    },
  ]

  return {
    client: shouldMockBitcoinClient ? new MockBitcoinClient() : undefined,
    network,
    credentials: !shouldMockBitcoinClient ? credentials : undefined,
  }
}

export const getDefaultThresholdLibProvider = () => {
  return new JsonRpcProvider(getEnvVariable(EnvVariable.ETH_HOSTNAME_HTTP))
}

export const getThresholdLib = (providerOrSigner?: Provider | Signer) => {
  return new Threshold({
    ethereum: getInitialEthereumConfig(providerOrSigner),
    bitcoin: getInitialBitcoinConfig(),
  })
}

export const threshold = getThresholdLib(
  new JsonRpcProvider(getEnvVariable(EnvVariable.ETH_HOSTNAME_HTTP))
)
