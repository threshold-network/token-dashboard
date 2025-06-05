import { BaseChain } from "./BaseChain"
import { EVMChain } from "./EVMChain"
import { StarkNetChain } from "./StarkNetChain"
import { ChainType } from "../types/chain"
import { SupportedChainIds } from "../networks/enums/networks"
import { networks } from "../networks/utils/networks"

export class ChainRegistry {
  private static instance: ChainRegistry
  private chains: Map<string, BaseChain> = new Map()

  private constructor() {
    this.initializeChains()
  }

  static getInstance(): ChainRegistry {
    if (!ChainRegistry.instance) {
      ChainRegistry.instance = new ChainRegistry()
    }
    return ChainRegistry.instance
  }

  private initializeChains(): void {
    // Initialize EVM chains
    networks.forEach((network) => {
      const evmChain = new EVMChain(network.chainId, network.name, {
        displayName: network.chainParameters.chainName,
        rpcUrl: network.chainParameters.rpcUrls?.[0],
        explorerUrl: network.chainParameters.blockExplorerUrls?.[0],
        nativeToken: network.chainParameters.nativeCurrency,
      })
      this.registerChain(evmChain)
    })

    // Initialize StarkNet chains
    const starknetMainnet = new StarkNetChain(
      "0x534e5f4d41494e",
      "starknet",
      {
        displayName: "StarkNet Mainnet",
        explorerUrl: "https://starkscan.co",
        nativeToken: {
          symbol: "ETH",
          decimals: 18,
        },
      },
      SupportedChainIds.Ethereum // Proxy to Ethereum Mainnet
    )
    this.registerChain(starknetMainnet)

    const starknetSepolia = new StarkNetChain(
      "0x534e5f5345504f4c4941",
      "starknet-sepolia",
      {
        displayName: "StarkNet Sepolia",
        explorerUrl: "https://sepolia.starkscan.co",
        nativeToken: {
          symbol: "ETH",
          decimals: 18,
        },
      },
      SupportedChainIds.Sepolia // Proxy to Ethereum Sepolia
    )
    this.registerChain(starknetSepolia)
  }

  registerChain(chain: BaseChain): void {
    const key = this.getChainKey(chain.getId(), chain.getName())
    this.chains.set(key, chain)
  }

  getChain(
    chainIdOrName: string | number,
    chainName?: string
  ): BaseChain | undefined {
    // Try exact match first
    const exactKey = this.getChainKey(chainIdOrName, chainName)
    if (this.chains.has(exactKey)) {
      return this.chains.get(exactKey)
    }

    // Search by ID or name
    for (const chain of this.chains.values()) {
      if (chain.getId() === chainIdOrName || chain.getName() === chainName) {
        return chain
      }
    }

    return undefined
  }

  getChainByType(type: ChainType): BaseChain[] {
    return Array.from(this.chains.values()).filter(
      (chain) => chain.getType() === type
    )
  }

  getAllChains(): BaseChain[] {
    return Array.from(this.chains.values())
  }

  private getChainKey(chainId: string | number, chainName?: string): string {
    return `${chainId}_${chainName || ""}`
  }

  // Helper method to get effective chain ID for deposits
  getEffectiveChainId(
    chainIdOrName: string | number,
    chainName?: string
  ): number | undefined {
    const chain = this.getChain(chainIdOrName, chainName)
    if (!chain) return undefined

    if (chain.getType() === ChainType.STARKNET) {
      return (chain as StarkNetChain).getProxyChainId()
    }

    return chain.getId() as number
  }
}
