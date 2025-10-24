import { ExplorerDataType, SupportedChainIds } from "../enums/networks"
import {
  getStarkNetNetworkConfig,
  isEnabledStarkNetChainId,
} from "../../config/starknet"

export const createBlockExplorerLink = (
  prefix: string,
  id: string,
  type: ExplorerDataType
) => {
  switch (type) {
    case ExplorerDataType.TRANSACTION: {
      return `${prefix}/tx/${id}`
    }
    case ExplorerDataType.TOKEN: {
      return `${prefix}/token/${id}`
    }
    case ExplorerDataType.BLOCK: {
      return `${prefix}/block/${id}`
    }
    case ExplorerDataType.ADDRESS:
    default: {
      return `${prefix}/address/${id}`
    }
  }
}

export const createExplorerPrefix = (
  chainId: number | string | undefined
): string => {
  // Check if it's a StarkNet chain first (using centralized config)
  if (chainId && isEnabledStarkNetChainId(chainId)) {
    const config = getStarkNetNetworkConfig(chainId)
    return config.explorerUrl
  }

  const prefixMap: { [key: number]: string } = {
    [SupportedChainIds.Sepolia]: "https://sepolia.etherscan.io",
    [SupportedChainIds.Arbitrum]: "https://arbiscan.io",
    [SupportedChainIds.Base]: "https://basescan.org",
    [SupportedChainIds.BaseSepolia]: "https://sepolia.basescan.org",
    [SupportedChainIds.ArbitrumSepolia]: "https://sepolia.arbiscan.io",
    [SupportedChainIds.Bob]: "https://explorer.gobob.xyz/",
    [SupportedChainIds.BobSepolia]: "https://bob-sepolia.explorer.gobob.xyz",
  }

  return prefixMap[Number(chainId)] || "https://etherscan.io"
}

export const createExplorerLink = (
  chainId: number | string | undefined,
  address: string,
  type: ExplorerDataType
): string => {
  const prefix = createExplorerPrefix(chainId)
  return createBlockExplorerLink(prefix, address, type)
}
