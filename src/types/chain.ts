export enum ChainType {
  EVM = "EVM",
  STARKNET = "STARKNET",
  SOLANA = "SOLANA",
}

export interface ChainIdentifier {
  type: ChainType
  id: string | number
  name: string
}

export interface ChainMetadata {
  displayName: string
  icon?: string
  rpcUrl?: string
  explorerUrl?: string
  nativeToken?: {
    symbol: string
    decimals: number
  }
}

export interface ChainValidation {
  isValidAddress(address: string): boolean
  isValidChainId(chainId: string | number): boolean
  normalizeChainId(chainId: string | number): string | number
}

export interface ChainDepositInfo {
  effectiveChainId: number | string
  depositAddress: string
  extraData?: any
}
