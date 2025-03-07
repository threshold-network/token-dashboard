import { SupportedChainIds } from "../enums/networks"
import { isTestnetChainId } from "../utils"

export const getMainnetOrTestnetChainId = (chainId?: number | string) => {
  return chainId && isTestnetChainId(chainId)
    ? SupportedChainIds.Sepolia
    : SupportedChainIds.Ethereum
}
