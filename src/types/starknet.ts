// StarkNet-specific type definitions for Token Dashboard

import { ChainName } from "../threshold-ts/types"

// StarkNet chain configuration interface
export interface StarkNetChainConfig {
  chainId: string // Hex string like "0x534e5f4d41494e"
  chainName: string // Human readable name
  rpcUrl: string
  explorerUrl: string
  networkType: "mainnet" | "testnet"
}

// StarkNet deposit data interface
export interface StarkNetDepositData {
  type: "non-evm"
  chain: "Starknet"
  address: string // StarkNet address
  mode: "L1Transaction" // StarkNet uses L1Transaction mode
  provider?: any // StarkNet provider instance
}

// StarkNet-specific deposit configuration
export interface StarkNetDepositConfig {
  l2DepositOwner: string // StarkNet address receiving tBTC
  btcRecoveryAddress: string // Bitcoin address for recovery
  chainId: string // StarkNet chain ID
  relayerUrl?: string // Optional custom relayer URL
}

// StarkNet provider interface (simplified)
export interface StarkNetProvider {
  account?: {
    address: string
  }
  address?: string // Alternative provider structure
  selectedAddress?: string // Another alternative
  getChainId?: () => Promise<string>
  request?: (request: { type: string; params?: any }) => Promise<any>
}

// StarkNet connection status
export interface StarkNetConnectionStatus {
  isConnected: boolean
  address: string | null
  chainId: string | null
  provider: StarkNetProvider | null
  isInitializing: boolean
  error: string | null
}

// StarkNet initialization state for ThresholdContext
export interface StarkNetContextState {
  isCrossChainInitializing: boolean
  crossChainError: string | null
  isStarkNetReady: boolean
  starkNetAddress: string | null
}

// StarkNet wallet configuration
export interface StarkNetWalletConfig {
  name: string
  icon?: string
  downloadUrl?: string
  isInstalled: boolean
}

// Type guards for StarkNet objects
export function isStarkNetDeposit(
  deposit: any
): deposit is StarkNetDepositData {
  return (
    deposit &&
    deposit.type === "non-evm" &&
    deposit.chain === "Starknet" &&
    typeof deposit.address === "string"
  )
}

export function isStarkNetProvider(
  provider: any
): provider is StarkNetProvider {
  return (
    provider &&
    (provider.account?.address || provider.address || provider.selectedAddress)
  )
}

export function isStarkNetChainId(chainId: string | number): boolean {
  if (typeof chainId === "string") {
    return (
      chainId === "0x534e5f4d41494e" || chainId === "0x534e5f5345504f4c4941"
    )
  }
  // For numeric chain IDs (converted from hex)
  return chainId === 0x534e5f4d41494e || chainId === -1 // -1 is our special marker for Sepolia
}

// Chain name mapping constants
export const STARKNET_L2_CHAIN_NAME: ChainName = ChainName.Starknet
export const STARKNET_SDK_CHAIN_NAME = "StarkNet" // SDK expects "StarkNet"

// StarkNet network constants
export const STARKNET_MAINNET_CHAIN_ID = "0x534e5f4d41494e"
export const STARKNET_SEPOLIA_CHAIN_ID = "0x534e5f5345504f4c4941"

// StarkNet configuration defaults
export const STARKNET_DEFAULTS = {
  mainnet: {
    relayerUrl: "https://relayer.tbtcscan.com/api/reveal",
    rpcUrl: "https://starknet-mainnet.public.blastapi.io",
    explorerUrl: "https://starkscan.co",
  },
  testnet: {
    relayerUrl: "http://relayer.tbtcscan.com/api/reveal",
    rpcUrl: "https://starknet-sepolia.public.blastapi.io",
    explorerUrl: "https://sepolia.starkscan.co",
  },
}

export default {
  isStarkNetDeposit,
  isStarkNetProvider,
  isStarkNetChainId,
  STARKNET_L2_CHAIN_NAME,
  STARKNET_SDK_CHAIN_NAME,
  STARKNET_MAINNET_CHAIN_ID,
  STARKNET_SEPOLIA_CHAIN_ID,
  STARKNET_DEFAULTS,
}
