import { validateAndParseAddress } from "starknet"
import { BaseChain } from "./BaseChain"
import {
  ChainType,
  ChainIdentifier,
  ChainMetadata,
  ChainDepositInfo,
} from "../types/chain"
import { SupportedChainIds } from "../networks/enums/networks"

export class StarkNetChain extends BaseChain {
  private readonly proxyChainId: number

  constructor(
    chainId: string,
    name: string,
    metadata: ChainMetadata,
    proxyChainId: number = SupportedChainIds.Sepolia
  ) {
    const identifier: ChainIdentifier = {
      type: ChainType.STARKNET,
      id: chainId,
      name: name,
    }
    super(identifier, metadata)
    this.proxyChainId = proxyChainId
  }

  isValidAddress(address: string): boolean {
    try {
      validateAndParseAddress(address)
      return true
    } catch {
      return false
    }
  }

  isValidChainId(chainId: string | number): boolean {
    if (typeof chainId === "string") {
      // StarkNet chain IDs are hex strings
      return chainId.startsWith("0x") && chainId.length > 2
    }
    return false
  }

  normalizeChainId(chainId: string | number): string {
    if (typeof chainId === "string") {
      return chainId.toLowerCase()
    }
    // Convert number to hex if needed
    return `0x${chainId.toString(16)}`
  }

  getDepositInfo(depositAddress: string, extraData?: any): ChainDepositInfo {
    return {
      effectiveChainId: this.proxyChainId, // Use proxy chain ID for tBTC SDK
      depositAddress: depositAddress,
      extraData: {
        starknetChainId: this.identifier.id,
        starknetAddress: extraData?.starknetAddress,
        ...extraData,
      },
    }
  }

  formatChainId(): string {
    return this.identifier.id.toString()
  }

  parseChainId(chainId: string): string {
    return chainId.toLowerCase()
  }

  getProxyChainId(): number {
    return this.proxyChainId
  }
}
