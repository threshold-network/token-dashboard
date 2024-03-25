import { TRMNetworksChainId } from "../enums"

type TRMNetworksMap = {
  [chainId: number]: string
}

const trmNetworksMap: TRMNetworksMap = {
  [TRMNetworksChainId.ethereum]: "ethereum",
}

const chainIdToTRMNetworkName = (
  chainId: string | number = 1
): string | null => {
  const network = trmNetworksMap[Number(chainId)]
  return network || null
}

export default chainIdToTRMNetworkName
