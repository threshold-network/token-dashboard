import { JsonRpcProvider, Provider } from "@ethersproject/providers"
import { Signer } from "ethers"
import { Threshold } from "../threshold-ts"
import { EnvVariable } from "../enums"
import {
  getDefaultProviderChainId,
  getEnvVariable,
  shouldUseTestnetDevelopmentContracts,
} from "../utils/getEnvVariable"
import {
  isSupportedNetwork,
  isTestnetNetwork,
} from "../networks/utils/connectedNetwork"
import { getRpcUrl } from "../networks/utils/getRpcUrl"
import { MockBitcoinClient } from "../tbtc/mock-bitcoin-client"
import {
  BitcoinConfig,
  BitcoinNetwork,
  BitcoinClientCredentials,
  EthereumConfig,
} from "../threshold-ts/types"
import { SupportedChainIds } from "../networks/enums/networks"

const defaultProviderChainId = getDefaultProviderChainId()

function getInitialEthereumConfig(
  providerOrSigner?: Provider | Signer
): EthereumConfig {
  return {
    chainId: getDefaultProviderChainId(),
    providerOrSigner:
      providerOrSigner || getThresholdLibProvider(defaultProviderChainId),
    shouldUseTestnetDevelopmentContracts:
      defaultProviderChainId === SupportedChainIds.Sepolia &&
      shouldUseTestnetDevelopmentContracts,
  }
}

function getInitialBitcoinConfig(): BitcoinConfig {
  const network = isTestnetNetwork(defaultProviderChainId)
    ? BitcoinNetwork.Testnet
    : BitcoinNetwork.Mainnet

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

export const getThresholdLibProvider = (chainId?: number | string) => {
  const supportedChainId = isSupportedNetwork(chainId)
    ? Number(chainId)
    : getDefaultProviderChainId()

  const rpcUrl = getRpcUrl(supportedChainId)

  return new JsonRpcProvider(rpcUrl, supportedChainId)
}

export const getThresholdLib = (providerOrSigner?: Provider | Signer) => {
  return new Threshold({
    ethereum: getInitialEthereumConfig(providerOrSigner),
    bitcoin: getInitialBitcoinConfig(),
  })
}

export const threshold = getThresholdLib(getThresholdLibProvider())
