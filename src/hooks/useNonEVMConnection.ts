// import {
//   useAnchorWallet,
//   useConnection,
//   useWallet as useSolanaWallet,
// } from "@solana/wallet-adapter-react"
import { useWallet as useSUIWalletKit } from "@suiet/wallet-kit" // Import directly from the kit
import { useCallback } from "react"
import { ChainName } from "../threshold-ts/types"
// import { AnchorProvider } from "@coral-xyz/anchor"
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
  nonEVMProvider: any | null // Changed from AnchorProvider
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
 * Checks if a non-EVM wallet (SUI) is connected to the dashboard.
 * Solana support has been temporarily disabled.
 *
 * Returns whether the wallet is active, its publicKey, and methods to
 * connect, disconnect, and select different wallets.
 * @return {NonEVMConnection}
 */
export function useNonEVMConnection(): NonEVMConnection {
  // Solana wallet connection - temporarily disabled
  // const {
  //   publicKey: solanaPublicKey,
  //   wallet: solanaWallet,
  //   connected: isSolanaConnected,
  //   connecting: isSolanaConnecting,
  //   disconnecting: isSolanaDisconnecting,
  //   disconnect: disconnectSolana,
  // } = useSolanaWallet()

  // SUI wallet connection
  const {
    account: suiAccount, // from @suiet/wallet-kit
    connected: isSUIConnected, // from @suiet/wallet-kit
    disconnect: disconnectSuiet, // from @suiet/wallet-kit
    connecting: isSUIConnecting, // from @suiet/wallet-kit
    adapter: suiAdapter, // from @suiet/wallet-kit, provides name and icon
  } = useSUIWalletKit()

  // const { connection } = useConnection()
  // const solanaAnchorWallet = useAnchorWallet()

  // const isSolanaActive = isSolanaConnected && !!solanaPublicKey
  const isSUIActive = isSUIConnected && !!suiAccount?.address

  const connectionData: NonEVMConnection = {
    ...defaultNonEVMConnection,
  }

  // Handle Solana wallet connection - temporarily disabled
  // if (isSolanaActive && solanaAnchorWallet) {
  //   connectionData.nonEVMProvider = new AnchorProvider(
  //     connection,
  //     solanaAnchorWallet,
  //     {}
  //   )
  //   connectionData.nonEVMChainName = ChainName.Solana
  //   connectionData.nonEVMPublicKey = solanaPublicKey.toBase58() ?? null
  //   connectionData.isNonEVMActive = isSolanaActive
  //   connectionData.connectedWalletName = solanaWallet?.adapter?.name
  //   connectionData.connectedWalletIcon = solanaWallet?.adapter?.icon
  //   connectionData.isNonEVMConnecting = isSolanaConnecting
  //   connectionData.isNonEVMDisconnecting = isSolanaDisconnecting
  // }
  // Handle SUI wallet connection
  if (isSUIActive && suiAccount?.address) {
    // For SUI, we use null as provider since it's not using AnchorProvider
    connectionData.nonEVMProvider = null
    connectionData.nonEVMChainName = ChainName.SUI as unknown as Exclude<
      keyof typeof ChainName,
      "Ethereum"
    >
    connectionData.nonEVMPublicKey = suiAccount.address
    connectionData.isNonEVMActive = isSUIActive
    connectionData.connectedWalletName = suiAdapter?.name
    connectionData.connectedWalletIcon = suiAdapter?.icon
    connectionData.isNonEVMConnecting = isSUIConnecting
    // The kit might not explicitly have a disconnecting state, map to connecting or assume false
    connectionData.isNonEVMDisconnecting = false
  }

  const disconnectWallet = useCallback(async () => {
    try {
      // if (isSolanaConnected && !!solanaPublicKey) {
      //   await disconnectSolana()
      // } else
      if (isSUIActive) {
        await disconnectSuiet()
      }
    } catch (error) {
      console.error("Failed to disconnect SUI wallet:", error)
    }
  }, [isSUIActive, disconnectSuiet])

  return {
    ...connectionData,
    disconnectNonEVM: disconnectWallet,
  }
}
