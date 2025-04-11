import {
  useAnchorWallet,
  useConnection,
  useWallet as useSolanaWallet,
} from "@solana/wallet-adapter-react"
import { useWallet as useSUIWallet } from "../contexts/SUIWalletProvider"
import { useCallback } from "react"
import { ChainName } from "../threshold-ts/types"
import { AnchorProvider } from "@coral-xyz/anchor"
import { NonEVMNetworks } from "../web3/types"

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
 * Checks if a non-EVM wallet (Solana or SUI) is connected to the dashboard.
 *
 * Returns whether the wallet is active, its publicKey, and methods to
 * connect, disconnect, and select different wallets.
 * @return {NonEVMConnection}
 */
export function useNonEVMConnection(): NonEVMConnection {
  // Solana wallet connection
  const {
    publicKey: solanaPublicKey,
    wallet: solanaWallet,
    connected: isSolanaConnected,
    connecting: isSolanaConnecting,
    disconnecting: isSolanaDisconnecting,
    disconnect: disconnectSolana,
  } = useSolanaWallet()

  // SUI wallet connection
  const {
    account: suiAccount,
    connected: isSUIConnected,
    disconnect: disconnectSUI,
  } = useSUIWallet()

  const { connection } = useConnection()
  const solanaAnchorWallet = useAnchorWallet()

  const isSolanaActive = isSolanaConnected && !!solanaPublicKey
  const isSUIActive = isSUIConnected && !!suiAccount

  const connectionData: NonEVMConnection = {
    ...defaultNonEVMConnection,
  }

  // Handle Solana wallet connection
  if (isSolanaActive && solanaAnchorWallet) {
    connectionData.nonEVMProvider = new AnchorProvider(
      connection,
      solanaAnchorWallet,
      {}
    )
    connectionData.nonEVMChainName = ChainName.Solana
    connectionData.nonEVMPublicKey = solanaPublicKey.toBase58() ?? null
    connectionData.isNonEVMActive = isSolanaActive
    connectionData.connectedWalletName = solanaWallet?.adapter?.name
    connectionData.connectedWalletIcon = solanaWallet?.adapter?.icon
    connectionData.isNonEVMConnecting = isSolanaConnecting
    connectionData.isNonEVMDisconnecting = isSolanaDisconnecting
  }
  // Handle SUI wallet connection
  else if (isSUIActive && suiAccount?.address) {
    // For SUI, we use null as provider since it's not using AnchorProvider
    connectionData.nonEVMProvider = null
    connectionData.nonEVMChainName = ChainName.SUI as unknown as Exclude<
      keyof typeof ChainName,
      "Ethereum"
    >
    connectionData.nonEVMPublicKey = suiAccount.address ?? null
    connectionData.isNonEVMActive = isSUIActive
    connectionData.connectedWalletName = "SUI Wallet"
    // SUI wallet doesn't provide icon through the hook
    connectionData.connectedWalletIcon = undefined
    connectionData.isNonEVMConnecting = false
    connectionData.isNonEVMDisconnecting = false
  }

  const disconnectWallet = useCallback(async () => {
    try {
      if (isSolanaConnected && !!solanaPublicKey) {
        await disconnectSolana()
      } else if (isSUIConnected && !!suiAccount) {
        await disconnectSUI()
      }
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
    }
  }, [
    disconnectSolana,
    isSolanaConnected,
    solanaPublicKey,
    disconnectSUI,
    isSUIConnected,
    suiAccount,
  ])

  return {
    ...connectionData,
    disconnectNonEVM: disconnectWallet,
  }
}
