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
  isTestnetChainId,
} from "../networks/utils/connectedNetwork"
import { hexToNumber } from "../networks/utils/chainId"
import { getRpcUrl } from "../networks/utils/getRpcUrl"
import { MockBitcoinClient } from "../tbtc/mock-bitcoin-client"
import {
  BitcoinConfig,
  BitcoinNetwork,
  BitcoinClientCredentials,
  EthereumConfig,
} from "../threshold-ts/types"
import { SupportedChainIds } from "../networks/enums/networks"
import { getDefaultBitcoinCredentials } from "./getDefaultBitcoinCredentials"

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
  const bitcoinNetwork = isTestnetChainId(defaultProviderChainId)
    ? BitcoinNetwork.Testnet
    : BitcoinNetwork.Mainnet

  const shouldMockBitcoinClient =
    getEnvVariable(EnvVariable.MOCK_BITCOIN_CLIENT) === "true"

  const credentials: BitcoinClientCredentials[] = getDefaultBitcoinCredentials()

  return {
    client: shouldMockBitcoinClient ? new MockBitcoinClient() : undefined,
    network: bitcoinNetwork,
    credentials: !shouldMockBitcoinClient ? credentials : undefined,
  }
}

export const getThresholdLibProvider = (chainId?: number | string) => {
  const supportedChainId =
    isSupportedNetwork(chainId) && chainId !== undefined
      ? hexToNumber(chainId)
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
