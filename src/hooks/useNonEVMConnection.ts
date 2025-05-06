import {
  useAnchorWallet,
  useConnection,
  useWallet as useSolanaWallet,
} from "@solana/wallet-adapter-react"
import { useCallback } from "react"
import { ChainName } from "../threshold-ts/types"
import { AnchorProvider } from "@coral-xyz/anchor"

const defaultNonEVMConnection = {
  nonEVMProvider: null,
  nonEVMChainName: null,
  isNonEVMActive: false,
  nonEVMPublicKey: null,
  connectedWalletName: undefined,
  connectedWalletIcon: undefined,
  disconnectNonEVM: async () => {},
  isNonEVMConnecting: false,
  isNonEVMDisconnecting: false,
}

export type NonEVMConnection = {
  nonEVMProvider: AnchorProvider | null
  nonEVMChainName: Exclude<keyof typeof ChainName, "Ethereum"> | null
  nonEVMPublicKey: string | null
  isNonEVMActive: boolean
  connectedWalletName: string | undefined
  connectedWalletIcon: string | undefined
  disconnectNonEVM: () => Promise<void>
  isNonEVMConnecting: boolean | undefined
  isNonEVMDisconnecting: boolean | undefined
}

/**
 * Checks if solana wallet is connected to the dashboard.
 *
 * Returns whether the wallet is active, its publicKey, and methods to
 * connect, disconnect, and select different wallets.
 * @return {NonEVMConnection}
 */
export function useNonEVMConnection(): NonEVMConnection {
  const {
    publicKey: solanaPublicKey,
    wallet: solanaWallet,
    connected: isSolanaConnected,
    connecting: isSolanaConnecting,
    disconnecting: isSolanaDisconnecting,
    disconnect: disconnectSolana,
  } = useSolanaWallet()

  const { connection } = useConnection()
  const wallet = useAnchorWallet()

  const isSolanaActive = isSolanaConnected && !!solanaPublicKey

  const connectionData: NonEVMConnection = {
    ...defaultNonEVMConnection,
  }

  if (isSolanaActive && wallet) {
    connectionData.nonEVMProvider = new AnchorProvider(connection, wallet, {})
    connectionData.nonEVMChainName = ChainName.Solana
    connectionData.nonEVMPublicKey = solanaPublicKey.toBase58() ?? null
    connectionData.isNonEVMActive = isSolanaActive
    connectionData.connectedWalletName = solanaWallet?.adapter?.name
    connectionData.connectedWalletIcon = solanaWallet?.adapter?.icon
    connectionData.isNonEVMConnecting = isSolanaConnecting
    connectionData.isNonEVMDisconnecting = isSolanaDisconnecting
  }

  const disconnectWallet = useCallback(async () => {
    try {
      if (isSolanaConnected && !!solanaPublicKey) {
        await disconnectSolana()
      }
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
    }
  }, [disconnectSolana, isSolanaConnected, solanaPublicKey])

  return {
    ...connectionData,
    disconnectNonEVM: disconnectWallet,
  }
}
