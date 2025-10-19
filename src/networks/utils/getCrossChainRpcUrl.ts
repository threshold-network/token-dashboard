import { EnvVariable } from "../../enums"
import { getEnvVariable } from "../../utils/getEnvVariable"
import { SupportedChainIds } from "../enums/networks"
import { networksAlchemyConfig } from "./networksAlchemyConfig"

const MAIN_ALCHEMY_URL = "g.alchemy.com/v2/"

export const getCrossChainRpcUrl = (chainId: number | string): string => {
  const alchemyApiKey = getEnvVariable(EnvVariable.ALCHEMY_API_KEY)
  const chainIdNum = Number(chainId)
  const alchemyConfig = networksAlchemyConfig[chainIdNum as SupportedChainIds]

  if (alchemyConfig?.name) {
    return `https://${alchemyConfig.name}-${alchemyConfig.type}.${MAIN_ALCHEMY_URL}${alchemyApiKey}`
  }

  // Fallback to public RPCs if no Alchemy config
  switch (chainIdNum) {
    case SupportedChainIds.Arbitrum:
      return "https://arb1.arbitrum.io/rpc"
    case SupportedChainIds.Base:
      return "https://mainnet.base.org"
    case SupportedChainIds.ArbitrumSepolia:
      return "https://sepolia-rollup.arbitrum.io/rpc"
    case SupportedChainIds.BaseSepolia:
      return "https://sepolia.base.org"
    case SupportedChainIds.Bob:
      return "https://rpc.gobob.xyz"
    case SupportedChainIds.BobSepolia:
      return "https://bob-sepolia.rpc.gobob.xyz/"
    default:
      throw new Error(`No RPC URL configured for chain ID ${chainId}`)
  }
}
