import { useWallet as useSuiWallet } from "@suiet/wallet-kit"
import { useCallback, useMemo } from "react"
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

  const disconnectNonEVMWallet = useCallback(async () => {
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

  // Memoize SUI signer to keep stable reference across renders
  const memoizedSuiSigner = useMemo(() => {
    if (!isSuiActive || !suiAccount) return null
    return {
      // Provide wallet adapter signing method expected by the SDK
      signAndExecuteTransaction: suiWallet.signAndExecuteTransaction,
      getAddress: async () => suiAccount.address,
      address: suiAccount.address,
      getPublicKey: () => suiAccount.publicKey,
    }
  }, [
    isSuiActive,
    suiAccount?.address,
    suiAccount?.publicKey,
    suiWallet.signAndExecuteTransaction,
  ])

  // Compute SUI chain id with fallback, without noisy logs
  const memoizedSuiChainId = useMemo(() => {
    if (!isSuiActive) return null
    const isMainnet = isMainnetChainId(getEthereumDefaultProviderChainId())
    const expectedChainId = isMainnet ? "sui:mainnet" : "sui:testnet"
    const actual = suiChain?.id ?? null
    if (!actual || actual === "unknown:unknown") return expectedChainId
    return actual
  }, [isSuiActive, suiChain?.id])

  const connectionData: UseNonEVMConnectionResult = useMemo(() => {
    // Default state
    let result: UseNonEVMConnectionResult = { ...defaultNonEVMConnection }

    if (isStarknetActive) {
      result = {
        ...result,
        nonEVMChainName: "StarkNet" as Exclude<
          keyof typeof ChainName,
          "Ethereum"
        >,
        nonEVMPublicKey: starknetAddress ?? null,
        nonEVMProvider: starknetProvider ?? null,
        nonEVMChainId: starknetChainId ?? null,
        isNonEVMActive: isStarknetConnected,
        connectedWalletName: starknetWalletName ?? null,
        connectedWalletIcon: starknetWalletIcon ?? null,
        isNonEVMConnecting: isStarknetConnecting,
        isNonEVMDisconnecting: false,
      }
    } else if (isSuiActive && suiAccount) {
      result = {
        ...result,
        nonEVMProvider: memoizedSuiSigner,
        nonEVMChainName: "Sui",
        nonEVMPublicKey: suiAccount.address,
        nonEVMChainId: memoizedSuiChainId,
        isNonEVMActive: true,
        connectedWalletName: suiWalletName ?? null,
        connectedWalletIcon: suiAdapter?.icon ?? null,
        isNonEVMConnecting: isSuiConnecting,
        isNonEVMDisconnecting: false,
      }
    }

    return result
  }, [
    // Starknet deps
    isStarknetActive,
    starknetAddress,
    starknetProvider,
    starknetChainId,
    isStarknetConnected,
    starknetWalletName,
    starknetWalletIcon,
    isStarknetConnecting,
    // Sui deps
    isSuiActive,
    suiAccount?.address,
    memoizedSuiSigner,
    memoizedSuiChainId,
    suiWalletName,
    suiAdapter?.icon,
    isSuiConnecting,
  ])

  return { ...connectionData, disconnectNonEVMWallet }
}
