import {
  AlchemyName,
  Layer,
  NetworkType,
  SupportedChainIds,
  NativeCurrency,
  PublicRpcUrls,
} from "../enums/networks"
import { Network } from "../types/networks"
import { DECIMALS, ETH_SYMBOL } from "../constants/networks"
import { toHex } from "./chainId"
import { createExplorerPrefix } from "./createExplorerLink"

export const networks: Network[] = [
  {
    chainId: SupportedChainIds.Ethereum,
    name: "Ethereum",
    layer: Layer.L1,
    networkType: NetworkType.Mainnet,
    alchemyName: AlchemyName.Ethereum,
    chainParameters: {
      chainId: toHex(SupportedChainIds.Ethereum),
      chainName: "Ethereum Mainnet",
      nativeCurrency: {
        name: NativeCurrency.Ether,
        symbol: ETH_SYMBOL,
        decimals: DECIMALS,
      },
      rpcUrls: [PublicRpcUrls.Ethereum],
      blockExplorerUrls: [createExplorerPrefix(SupportedChainIds.Ethereum)],
    },
  },
  {
    chainId: SupportedChainIds.Arbitrum,
    name: "Arbitrum",
    layer: Layer.L2,
    networkType: NetworkType.Mainnet,
    alchemyName: AlchemyName.Arbitrum,
    chainParameters: {
      chainId: toHex(SupportedChainIds.Arbitrum),
      chainName: "Arbitrum One",
      nativeCurrency: {
        name: NativeCurrency.Ether,
        symbol: ETH_SYMBOL,
        decimals: DECIMALS,
      },
      rpcUrls: [PublicRpcUrls.Arbitrum],
      blockExplorerUrls: [createExplorerPrefix(SupportedChainIds.Arbitrum)],
    },
  },
  {
    chainId: SupportedChainIds.Localhost,
    name: "Ethereum",
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
      rpcUrls: [PublicRpcUrls.Localhost],
      blockExplorerUrls: ["http://localhost:8545"],
    },
  },
  {
    chainId: SupportedChainIds.Base,
    name: "Base",
    layer: Layer.L2,
    networkType: NetworkType.Mainnet,
    alchemyName: AlchemyName.Base,
    chainParameters: {
      chainId: toHex(SupportedChainIds.Base),
      chainName: "Base Mainnet",
      nativeCurrency: {
        name: NativeCurrency.Ether,
        symbol: ETH_SYMBOL,
        decimals: DECIMALS,
      },
      rpcUrls: [PublicRpcUrls.Base],
      blockExplorerUrls: [createExplorerPrefix(SupportedChainIds.Base)],
    },
  },
  {
    chainId: SupportedChainIds.Sepolia,
    name: "Ethereum",
    layer: Layer.L1,
    networkType: NetworkType.Testnet,
    alchemyName: AlchemyName.Ethereum,
    chainParameters: {
      chainId: toHex(SupportedChainIds.Sepolia),
      chainName: "Sepolia Testnet",
      nativeCurrency: {
        name: NativeCurrency.SepoliaEther,
        symbol: ETH_SYMBOL,
        decimals: DECIMALS,
      },
      rpcUrls: [PublicRpcUrls.Sepolia],
      blockExplorerUrls: [createExplorerPrefix(SupportedChainIds.Sepolia)],
    },
  },
  // StarkNet networks are handled separately via StarkNet wallet connection
  // {
  //   chainId: SupportedChainIds.StarkNet,
  //   name: "StarkNet",
  //   layer: Layer.L2,
  //   networkType: NetworkType.Mainnet,
  //   chainParameters: {
  //     chainId: "0x534e5f4d41494e",
  //     chainName: "StarkNet Mainnet",
  //     nativeCurrency: {
  //       name: "Ether",
  //       symbol: ETH_SYMBOL,
  //       decimals: DECIMALS,
  //     },
  //     rpcUrls: ["https://starknet-mainnet.public.blastapi.io"],
  //     blockExplorerUrls: [createExplorerPrefix(SupportedChainIds.StarkNet)],
  //   },
  // },
  // {
  //   chainId: SupportedChainIds.StarkNetSepolia,
  //   name: "StarkNet",
  //   layer: Layer.L2,
  //   networkType: NetworkType.Testnet,
  //   chainParameters: {
  //     chainId: "0x534e5f5345504f4c4941",
  //     chainName: "StarkNet Sepolia",
  //     nativeCurrency: {
  //       name: "Sepolia Ether",
  //       symbol: ETH_SYMBOL,
  //       decimals: DECIMALS,
  //     },
  //     rpcUrls: ["https://starknet-sepolia.public.blastapi.io"],
  //     blockExplorerUrls: [
  //       createExplorerPrefix(SupportedChainIds.StarkNetSepolia),
  //     ],
  //   },
  // },
  // {
  //   chainId: SupportedChainIds.ArbitrumSepolia,
  //   name: "Arbitrum",
  //   layer: Layer.L2,
  //   networkType: NetworkType.Testnet,
  //   alchemyName: AlchemyName.Arbitrum,
  //   chainParameters: {
  //     chainId: toHex(SupportedChainIds.ArbitrumSepolia),
  //     chainName: "Arbitrum Sepolia",
  //     nativeCurrency: {
  //       name: NativeCurrency.SepoliaEther,
  //       symbol: ETH_SYMBOL,
  //       decimals: DECIMALS,
  //     },
  //     rpcUrls: [PublicRpcUrls.ArbitrumSepolia],
  //     blockExplorerUrls: [
  //       createExplorerPrefix(SupportedChainIds.ArbitrumSepolia),
  //     ],
  //   },
  // },
  // {
  //   chainId: SupportedChainIds.BaseSepolia,
  //   name: "Base",
  //   layer: Layer.L2,
  //   networkType: NetworkType.Testnet,
  //   alchemyName: AlchemyName.Base,
  //   chainParameters: {
  //     chainId: toHex(SupportedChainIds.BaseSepolia),
  //     chainName: "Base Sepolia",
  //     nativeCurrency: {
  //       name: NativeCurrency.SepoliaEther,
  //       symbol: ETH_SYMBOL,
  //       decimals: DECIMALS,
  //     },
  //     rpcUrls: [PublicRpcUrls.BaseSepolia],
  //     blockExplorerUrls: [createExplorerPrefix(SupportedChainIds.BaseSepolia)],
  //   },
  // },
]
