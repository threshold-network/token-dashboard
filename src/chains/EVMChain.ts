import { ethers } from "ethers"
import { BaseChain } from "./BaseChain"
import {
  ChainType,
  ChainIdentifier,
  ChainMetadata,
  ChainDepositInfo,
} from "../types/chain"

export class EVMChain extends BaseChain {
  constructor(chainId: number, name: string, metadata: ChainMetadata) {
    const identifier: ChainIdentifier = {
      type: ChainType.EVM,
      id: chainId,
      name: name,
    }
    super(identifier, metadata)
  }

  isValidAddress(address: string): boolean {
    try {
      ethers.utils.getAddress(address)
      return true
    } catch {
      return false
    }
  }

  isValidChainId(chainId: string | number): boolean {
    if (typeof chainId === "number") {
      return chainId > 0 && chainId <= Number.MAX_SAFE_INTEGER
    }

    const numId = parseInt(chainId.toString(), 10)
    return !isNaN(numId) && numId > 0 && numId <= Number.MAX_SAFE_INTEGER
  }

  normalizeChainId(chainId: string | number): number {
    if (typeof chainId === "number") {
      return chainId
    }
    return parseInt(chainId.toString(), 10)
  }

  getDepositInfo(depositAddress: string, extraData?: any): ChainDepositInfo {
    return {
      effectiveChainId: this.identifier.id as number,
      depositAddress: depositAddress,
      extraData: extraData,
    }
  }

  formatChainId(): string {
    return this.identifier.id.toString()
  }

  parseChainId(chainId: string): number {
    return parseInt(chainId, 10)
  }
}
