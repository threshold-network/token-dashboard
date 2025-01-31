import { networks } from "./networks"

export function getChainIdToNetworkName(chainId?: number | string): string {
  const network = networks.find(
    (network) => network.chainId === Number(chainId)
  )
  return network ? network.name : "Unsupported"
}

export const chainIdToChainParameterName = (chainId?: string | number) => {
  const network = networks.find(
    (network) => network.chainId === Number(chainId)
  )
  return network?.chainParameters?.chainName || "Unsupported"
}
