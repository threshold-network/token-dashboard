import { useWallet as useSuiWallet } from "@suiet/wallet-kit"
import { useCallback } from "react"
import { ChainName } from "../threshold-ts/types"
import { useStarknetConnection } from "./useStarknetConnection"
import { getEthereumDefaultProviderChainId } from "../utils/getEnvVariable"
import { isMainnetChainId } from "../networks/utils"

const defaultNonEVMConnection = {
  nonEVMProvider: null,
  nonEVMChainName: null,
  nonEVMPublicKey: null,
  nonEVMChainId: null,
  isNonEVMActive: false,
  connectedWalletName: null,
  connectedWalletIcon: null,
  isNonEVMConnecting: false,
  isNonEVMDisconnecting: false,
  disconnectNonEVMWallet: async () => {},
}

export type UseNonEVMConnectionResult = {
  nonEVMProvider: any | null
  nonEVMChainName: Exclude<keyof typeof ChainName, "Ethereum"> | null
  nonEVMPublicKey: string | null
  nonEVMChainId: string | null
  isNonEVMActive: boolean
  connectedWalletName: string | null
  connectedWalletIcon: string | null
  isNonEVMConnecting: boolean
  isNonEVMDisconnecting: boolean
  disconnectNonEVMWallet: () => void
}

/**
 * Hook to manage non-EVM wallet connections.
 * Currently supports Starknet and Sui, designed to be extended for other non-EVM chains.
 *
 * @return {UseNonEVMConnectionResult} Connection state and functions for non-EVM chains
 */
export function useNonEVMConnection(): UseNonEVMConnectionResult {
  // Get Starknet connection data
  const {
    isConnected: isStarknetConnected,
    isConnecting: isStarknetConnecting,
    address: starknetAddress,
    provider: starknetProvider,
    chainId: starknetChainId,
    walletName: starknetWalletName,
    walletIcon: starknetWalletIcon,
    disconnect: disconnectStarknet,
  } = useStarknetConnection()

  const suiWallet = useSuiWallet()
  const {
    account: suiAccount,
    connected: isSuiConnected,
    connecting: isSuiConnecting,
    adapter: suiAdapter,
    name: suiWalletName,
    chain: suiChain,
  } = suiWallet

  const isStarknetActive = isStarknetConnected && !!starknetAddress
  const isSuiActive = isSuiConnected && !!suiAccount

  const connectionData: UseNonEVMConnectionResult = {
    ...defaultNonEVMConnection,
  }

  if (isStarknetActive) {
    // Determine which non-EVM chain is active
    // For now, only Starknet is supported
    connectionData.nonEVMChainName = "Starknet"
    connectionData.nonEVMPublicKey = starknetAddress ?? null
    connectionData.nonEVMProvider = starknetProvider ?? null
    connectionData.nonEVMChainId = starknetChainId ?? null
    connectionData.isNonEVMActive = isStarknetConnected
    connectionData.connectedWalletName = starknetWalletName ?? null
    connectionData.connectedWalletIcon = starknetWalletIcon ?? null
    connectionData.isNonEVMConnecting = isStarknetConnecting
    connectionData.isNonEVMDisconnecting = false // Starknet disconnect is synchronous
  } else if (isSuiActive && suiAccount) {
    console.log("suiWallet : ", suiWallet)
    const isMainnet = isMainnetChainId(getEthereumDefaultProviderChainId())
    const expectedChainId = isMainnet ? "sui:mainnet" : "sui:testnet"

    // Handle unknown chain case
    let actualChainId = suiChain?.id ?? null
    if (actualChainId === "unknown:unknown" || !actualChainId) {
      console.warn(
        `[useNonEVMConnection] SUI wallet on unknown chain, expected ${expectedChainId}`
      )
      console.log("[useNonEVMConnection] SUI chain details:", {
        chainId: suiChain?.id,
        chainName: suiChain?.name,
        chainRpcUrl: suiChain?.rpcUrl,
        availableChains: suiWallet.chains,
      })
      // Use expected chain ID as fallback
      actualChainId = expectedChainId
    } else {
      console.log(
        `[useNonEVMConnection] SUI wallet connected to chain: ${actualChainId}`
      )
    }

    const suiSigner = {
      ...suiWallet,
      getAddress: async () => suiAccount.address,
      address: suiAccount.address,
      getPublicKey: () => suiAccount.publicKey,
    }
    connectionData.nonEVMProvider = suiSigner
    connectionData.nonEVMChainName = "Sui"
    connectionData.nonEVMPublicKey = suiAccount.address
    connectionData.nonEVMChainId = actualChainId
    connectionData.isNonEVMActive = isSuiActive
    connectionData.connectedWalletName = suiWalletName ?? null
    connectionData.connectedWalletIcon = suiAdapter?.icon ?? null
    connectionData.isNonEVMConnecting = isSuiConnecting
    connectionData.isNonEVMDisconnecting = false
  }

  connectionData.disconnectNonEVMWallet = useCallback(async () => {
    try {
      if (isStarknetConnected) {
        disconnectStarknet()
      }
      if (suiWallet.connected && !!suiWallet.account) {
        await suiWallet.disconnect()
      }
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
    }
  }, [disconnectStarknet, isStarknetConnected, suiWallet])

  return connectionData
}
