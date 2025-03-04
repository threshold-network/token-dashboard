import { getDefaultProviderChainId } from "../../utils/getEnvVariable"
import { SupportedChainIds } from "../enums/networks"
import { isTestnetNetwork } from "./connectedNetwork"
import { networks } from "./networks"

function findSupportedNetwork(chainId?: number | string) {
  if (!chainId) return null

  const chainIdNumber = Number(chainId)
  const defaultChainId = getDefaultProviderChainId()

  return networks.find((network) =>
    defaultChainId === SupportedChainIds.Ethereum
      ? network.chainId === chainIdNumber && !isTestnetNetwork(network.chainId)
      : network.chainId === chainIdNumber && isTestnetNetwork(network.chainId)
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
