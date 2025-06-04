import { useMemo } from "react"
import { useStarknetWallet } from "../contexts/StarknetWalletProvider"
import { constants } from "starknet"

export interface UseStarknetConnectionResult {
  // Connection state
  isConnected: boolean
  isConnecting: boolean

  // Wallet data
  address: string | null
  provider: any | null // Full provider for SDK
  walletName: string | null
  walletIcon: string | null

  // Functions
  connect: () => Promise<void>
  disconnect: () => void

  // Chain data
  chainId: string | null // "0x534e5f4d41494e" or "0x534e5f5345504f4c4941"

  // Other
  availableWallets: any[]
  error: Error | null
}

/**
 * Hook for managing Starknet wallet connections.
 * Provides a clean interface for components to interact with Starknet wallets.
 * Compatible with the tBTC SDK's StarkNet integration requirements.
 * @return {UseStarknetConnectionResult} The connection state and functions
 */
export const useStarknetConnection = (): UseStarknetConnectionResult => {
  const {
    connect,
    disconnect,
    account,
    provider,
    connected,
    connecting,
    error,
    availableWallets,
    walletName,
    walletIcon,
  } = useStarknetWallet()

  // Determine chain ID based on provider
  const chainId = useMemo(() => {
    if (!provider) return null

    // Try to get chain ID from provider
    if (provider.chainId) {
      return provider.chainId
    }

    // Try to get from account if it exists
    if (provider.account?.chainId) {
      return provider.account.chainId
    }

    // Default to mainnet if we can't determine
    // This should be improved to actually detect the network
    return constants.StarknetChainId.SN_MAIN
  }, [provider])

  return {
    // Connection state
    isConnected: connected,
    isConnecting: connecting,

    // Wallet data
    address: account,
    provider,
    walletName,
    walletIcon,

    // Functions
    connect,
    disconnect,

    // Chain data
    chainId,

    // Other
    availableWallets,
    error,
  }
}

/**
 * Helper function to extract address from a StarkNet provider.
 * Follows the pattern used by the tBTC SDK.
 * @param {any} provider - The StarkNet provider object
 * @return {string | null} The extracted address or null if not found
 */
export const extractStarknetAddress = (provider: any): string | null => {
  if (!provider) return null

  // Check if it's an Account object with address property
  if ("address" in provider && typeof provider.address === "string") {
    return provider.address
  }

  // Check if it's a Provider with connected account
  if ("account" in provider && provider.account?.address) {
    return provider.account.address
  }

  // Check for selectedAddress (some wallets use this)
  if (
    "selectedAddress" in provider &&
    typeof provider.selectedAddress === "string"
  ) {
    return provider.selectedAddress
  }

  return null
}

/**
 * Helper function to determine if a provider is ready for SDK initialization.
 * The provider must have an extractable address.
 * @param {any} provider - The StarkNet provider object to check
 * @return {boolean} True if the provider is ready, false otherwise
 */
export const isProviderReady = (provider: any): boolean => {
  return provider !== null && extractStarknetAddress(provider) !== null
}
