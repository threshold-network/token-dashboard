import { SupportedChainIds, TrmNetworksChainId } from "../enums/networks"
import { TrmNetworksMap } from "../types/networks"

export const trmNetworksMap: TrmNetworksMap = {
  [TrmNetworksChainId.ethereum]: "ethereum",
  [TrmNetworksChainId.arbitrum]: "arbitrum",
  [TrmNetworksChainId.base]: "base",
}

export const chainIdToTrmNetworkName = (
  chainId?: string | number
): TrmNetworksMap => {
  const network =
    trmNetworksMap[Number(chainId)] ||
    trmNetworksMap[SupportedChainIds.Ethereum]
  return network
}
