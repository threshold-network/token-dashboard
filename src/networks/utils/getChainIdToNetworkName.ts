import { getDefaultProviderChainId } from "../../utils/getEnvVariable"
import { isMainnetChainId, isTestnetChainId } from "./connectedNetwork"
import { networks } from "./networks"
import { hexToNumber } from "./chainId"

function findSupportedNetwork(chainId?: number | string) {
  if (!chainId) return null

  const chainIdNumber = hexToNumber(chainId)
  const defaultChainId = getDefaultProviderChainId()

  return networks.find((network) =>
    isMainnetChainId(defaultChainId)
      ? network.chainId === chainIdNumber && isMainnetChainId(network.chainId)
      : network.chainId === chainIdNumber && isTestnetChainId(network.chainId)
  )
}

export function getChainIdToNetworkName(chainId?: number | string): string {
  return findSupportedNetwork(chainId)?.name ?? "Unsupported"
}

export function chainIdToChainParameterName(chainId?: number | string): string {
  return (
    findSupportedNetwork(chainId)?.chainParameters?.chainName ?? "Unsupported"
  )
}
