import {
  Layer,
  NetworkType,
  SupportedChainIds,
  NativeCurrency,
  NetworksName,
} from "../enums/networks"
import { Network } from "../types/networks"
import { DECIMALS, ETH_SYMBOL } from "../constants/networks"
import { toHex } from "./chainId"
import { createExplorerPrefix } from "./createExplorerLink"

export const networks: Network[] = [
  {
    chainId: SupportedChainIds.Ethereum,
    name: NetworksName.Ethereum,
    layer: Layer.L1,
    networkType: NetworkType.Mainnet,
    chainParameters: {
      chainId: toHex(SupportedChainIds.Ethereum),
      chainName: "Ethereum Mainnet",
      nativeCurrency: {
        name: NativeCurrency.Ether,
        symbol: ETH_SYMBOL,
        decimals: DECIMALS,
      },
      blockExplorerUrls: [createExplorerPrefix(SupportedChainIds.Ethereum)],
    },
  },
  {
    chainId: SupportedChainIds.Arbitrum,
    name: NetworksName.Arbitrum,
    layer: Layer.L2,
    networkType: NetworkType.Mainnet,
    chainParameters: {
      chainId: toHex(SupportedChainIds.Arbitrum),
      chainName: "Arbitrum One",
      nativeCurrency: {
        name: NativeCurrency.Ether,
        symbol: ETH_SYMBOL,
        decimals: DECIMALS,
      },
      blockExplorerUrls: [createExplorerPrefix(SupportedChainIds.Arbitrum)],
    },
  },
  {
    chainId: SupportedChainIds.Localhost,
    name: NetworksName.Ethereum,
    layer: Layer.L1,
    networkType: NetworkType.Testnet,
    chainParameters: {
      chainId: toHex(SupportedChainIds.Localhost),
      chainName: "Localhost",
      nativeCurrency: {
        name: NativeCurrency.Ether,
        symbol: ETH_SYMBOL,
        decimals: DECIMALS,
      },
      blockExplorerUrls: ["http://localhost:8545"],
    },
  },
  // {
  //   chainId: SupportedChainIds.Base,
  //   name: NetworksName.Base,
  //   layer: Layer.L2,
  //   networkType: NetworkType.Mainnet,
  //   chainParameters: {
  //     chainId: toHex(SupportedChainIds.Base),
  //     chainName: "Base Mainnet",
  //     nativeCurrency: {
  //       name: NativeCurrency.Ether,
  //       symbol: ETH_SYMBOL,
  //       decimals: DECIMALS,
  //     },
  //     blockExplorerUrls: [createExplorerPrefix(SupportedChainIds.Base)],
  //   },
  // },
  {
    chainId: SupportedChainIds.Sepolia,
    name: NetworksName.Ethereum,
    layer: Layer.L1,
    networkType: NetworkType.Testnet,
    chainParameters: {
      chainId: toHex(SupportedChainIds.Sepolia),
      chainName: "Sepolia Testnet",
      nativeCurrency: {
        name: NativeCurrency.SepoliaEther,
        symbol: ETH_SYMBOL,
        decimals: DECIMALS,
      },
      blockExplorerUrls: [createExplorerPrefix(SupportedChainIds.Sepolia)],
    },
  },
  {
    chainId: SupportedChainIds.ArbitrumSepolia,
    name: NetworksName.Arbitrum,
    layer: Layer.L2,
    networkType: NetworkType.Testnet,
    chainParameters: {
      chainId: toHex(SupportedChainIds.ArbitrumSepolia),
      chainName: "Arbitrum Sepolia",
      nativeCurrency: {
        name: NativeCurrency.SepoliaEther,
        symbol: ETH_SYMBOL,
        decimals: DECIMALS,
      },
      blockExplorerUrls: [
        createExplorerPrefix(SupportedChainIds.ArbitrumSepolia),
      ],
    },
  },
  {
    chainId: SupportedChainIds.BaseSepolia,
    name: NetworksName.Base,
    layer: Layer.L2,
    networkType: NetworkType.Testnet,
    chainParameters: {
      chainId: toHex(SupportedChainIds.BaseSepolia),
      chainName: "Base Sepolia",
      nativeCurrency: {
        name: NativeCurrency.SepoliaEther,
        symbol: ETH_SYMBOL,
        decimals: DECIMALS,
      },
      blockExplorerUrls: [createExplorerPrefix(SupportedChainIds.BaseSepolia)],
    },
  },
]
