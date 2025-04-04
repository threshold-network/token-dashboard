import { useWallet } from "@solana/wallet-adapter-react"
import type { PublicKey } from "@solana/web3.js"
import { useCallback, useMemo } from "react"

type UseIsActiveSolanaResult = {
  solanaPublicKey: PublicKey | undefined
  isSolanaActive: boolean
  solanaConnectedWalletName: string | undefined
  solanaConnectedWalletIcon: string | undefined
  disconnectSolana: () => Promise<void>
  isSolanaConnected: boolean
  isSolanaConnecting: boolean
  isSolanaDisconnecting: boolean
}

/**
 * Checks if solana wallet is connected to the dashboard.
 *
 * Returns whether the wallet is active, its publicKey, and methods to
 * connect, disconnect, and select different wallets.
 * @return {UseIsActiveSolanaResult} public key address and `isActive` boolean
 */
export function useIsActiveSolana(): UseIsActiveSolanaResult {
  const {
    publicKey,
    wallet,
    connected,
    connecting,
    disconnecting,
    disconnect,
  } = useWallet()

  // Whether there is an active wallet (connected + has publicKey).
  const isActive = useMemo(() => {
    return connected && !!publicKey
  }, [connected, publicKey])

  const disconnectWallet = useCallback(async () => {
    try {
      await disconnect()
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
    }
  }, [disconnect])

  return {
    solanaPublicKey: publicKey ?? undefined,
    isSolanaActive: isActive,
    solanaConnectedWalletName: wallet?.adapter?.name,
    solanaConnectedWalletIcon: wallet?.adapter?.icon,
    disconnectSolana: disconnectWallet,
    isSolanaConnected: connected,
    isSolanaConnecting: connecting,
    isSolanaDisconnecting: disconnecting,
  }
}
