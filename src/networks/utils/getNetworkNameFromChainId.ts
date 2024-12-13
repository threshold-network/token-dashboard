import { NetworksName } from "../enums/networks"
import { networks } from "./networks"

export function getNetworkNameFromChainId(
  chainId?: number | string
): NetworksName | "Unsupported" {
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
