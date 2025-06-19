import { getEthereumDefaultProviderChainId } from "../../utils/getEnvVariable"
import { Network } from "../types/networks"
import { isMainnetChainId, isTestnetChainId } from "./connectedNetwork"
import { networks } from "./networks"

function findEthereumSupportedNetwork(
  chainId?: number | string
): Network | null {
  if (!chainId) return null

  const chainIdNumber = Number(chainId)
  const defaultChainId = getEthereumDefaultProviderChainId()

  const ethereumSupporterdNetwork = networks.find((network) =>
    isMainnetChainId(defaultChainId)
      ? network.chainId === chainIdNumber && isMainnetChainId(network.chainId)
      : network.chainId === chainIdNumber && isTestnetChainId(network.chainId)
  )

  return ethereumSupporterdNetwork ? ethereumSupporterdNetwork : null
}

export function getEthereumNetworkNameFromChainId(
  chainId?: number | string
): string {
  return findEthereumSupportedNetwork(chainId)?.name ?? "Unsupported"
}

export function getParameterNameFromChainId(chainId?: number | string): string {
  return (
    findEthereumSupportedNetwork(chainId)?.chainParameters?.chainName ??
    "Unsupported"
  )
}
