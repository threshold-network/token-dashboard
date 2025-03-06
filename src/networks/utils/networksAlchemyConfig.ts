import { AlchemyName, NetworkType, SupportedChainIds } from "../enums/networks"
import { NetworksAlchemyConfig } from "../types/networks"

export const networksAlchemyConfig: NetworksAlchemyConfig = {
  [SupportedChainIds.Ethereum]: {
    name: AlchemyName.Ethereum,
    type: NetworkType.Mainnet,
  },
  [SupportedChainIds.Sepolia]: {
    name: AlchemyName.Ethereum,
    type: NetworkType.Testnet,
  },
  [SupportedChainIds.Arbitrum]: {
    name: AlchemyName.Arbitrum,
    type: NetworkType.Mainnet,
  },
  [SupportedChainIds.Base]: {
    name: AlchemyName.Base,
    type: NetworkType.Mainnet,
  },
  // [SupportedChainIds.BaseSepolia]: {
  //   name: AlchemyName.Base,
  //   type: NetworkType.Testnet,
  // },
  // [SupportedChainIds.ArbitrumSepolia]: {
  //   name: AlchemyName.Arbitrum,
  //   type: NetworkType.Testnet,
  // },
}
