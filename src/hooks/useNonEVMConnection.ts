import { ChainName } from "../threshold-ts/types"
import { useStarknetConnection } from "./useStarknetConnection"

export interface UseNonEVMConnectionResult {
  nonEVMChainName: ChainName | null
  nonEVMPublicKey: string | null
  nonEVMProvider: any | null
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
 * Currently supports Starknet, designed to be extended for other non-EVM chains.
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

  // In the future, add other non-EVM chains here
  // const { ... } = useSolanaConnection()
  // const { ... } = useSuiConnection()

  // Determine which non-EVM chain is active
  // For now, only Starknet is supported
  const nonEVMChainName = isStarknetConnected ? ChainName.Starknet : null
  const nonEVMPublicKey = isStarknetConnected ? starknetAddress : null
  const nonEVMProvider = isStarknetConnected ? starknetProvider : null
  const nonEVMChainId = isStarknetConnected ? starknetChainId : null
  const isNonEVMActive = isStarknetConnected
  const connectedWalletName = isStarknetConnected ? starknetWalletName : null
  const connectedWalletIcon = isStarknetConnected ? starknetWalletIcon : null
  const isNonEVMConnecting = isStarknetConnecting
  const isNonEVMDisconnecting = false // Starknet disconnect is synchronous

  const disconnectNonEVMWallet = () => {
    if (isStarknetConnected) {
      disconnectStarknet()
    }
    // In the future, add other chain disconnects here
  }

  return {
    nonEVMChainName,
    nonEVMPublicKey,
    nonEVMProvider,
    nonEVMChainId,
    isNonEVMActive,
    connectedWalletName,
    connectedWalletIcon,
    isNonEVMConnecting,
    isNonEVMDisconnecting,
    disconnectNonEVMWallet,
  }
}
