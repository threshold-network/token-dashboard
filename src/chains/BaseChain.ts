import {
  ChainType,
  ChainIdentifier,
  ChainMetadata,
  ChainValidation,
  ChainDepositInfo,
} from "../types/chain"

export abstract class BaseChain implements ChainValidation {
  protected identifier: ChainIdentifier
  protected metadata: ChainMetadata

  constructor(identifier: ChainIdentifier, metadata: ChainMetadata) {
    this.identifier = identifier
    this.metadata = metadata
  }

  getType(): ChainType {
    return this.identifier.type
  }

  getId(): string | number {
    return this.identifier.id
  }

  getName(): string {
    return this.identifier.name
  }

  getDisplayName(): string {
    return this.metadata.displayName
  }

  getMetadata(): ChainMetadata {
    return this.metadata
  }

  abstract isValidAddress(address: string): boolean
  abstract isValidChainId(chainId: string | number): boolean
  abstract normalizeChainId(chainId: string | number): string | number
  abstract getDepositInfo(
    depositAddress: string,
    extraData?: any
  ): ChainDepositInfo
  abstract formatChainId(): string
  abstract parseChainId(chainId: string): string | number
}
