import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react"
import { constants } from "starknet"
import { getEthereumDefaultProviderChainId } from "../utils/getEnvVariable"
import { isMainnetChainId } from "../networks/utils"

// Lazy load starknetkit to avoid module resolution issues
let starknetKitModule: any = null

const getStarknetKit = async () => {
  if (!starknetKitModule) {
    starknetKitModule = await import("starknetkit")
  }
  return starknetKitModule
}

// Determine the expected Starknet network based on EVM network
const getExpectedStarknetChainId = () => {
  const defaultChainId = getEthereumDefaultProviderChainId()
  return isMainnetChainId(defaultChainId)
    ? constants.StarknetChainId.SN_MAIN
    : constants.StarknetChainId.SN_SEPOLIA
}

// Define the wallet connection state interface
interface StarknetWalletContextValue {
  connect: () => Promise<void>
  disconnect: () => void
  account: string | null
  provider: any | null // Full provider object for SDK
  connected: boolean
  connecting: boolean
  error: Error | null
  availableWallets: any[]
  walletName: string | null
  walletIcon: string | null
  switchNetwork: (chainId: string) => Promise<void>
  currentWallet: any | null // Store the original wallet object
}

// Create the context
const StarknetWalletContext = createContext<
  StarknetWalletContextValue | undefined
>(undefined)

// Constants
const STARKNET_WALLET_KEY = "starknet-wallet"
const STARKNET_LAST_WALLET = "starknet-last-wallet"

// Helper function to extract chain ID from wallet object
const extractChainIdFromWallet = (wallet: any): string | null => {
  // Priority order for chain ID extraction
  // 1. Direct wallet.chainId
  if (wallet.chainId) return wallet.chainId

  // 2. Account chainId
  if (wallet.account?.chainId) return wallet.account.chainId

  // 3. Provider chainId
  if (wallet.provider?.chainId) return wallet.provider.chainId

  // 4. Provider getChainId method (synchronous call)
  if (
    wallet.provider?.getChainId &&
    typeof wallet.provider.getChainId === "function"
  ) {
    try {
      const chainId = wallet.provider.getChainId()
      if (chainId) return chainId
    } catch (e) {
      console.warn("Failed to get chain ID from provider.getChainId:", e)
    }
  }

  // 4b. Check if it's an async method that needs await
  // Note: This won't work in a sync function, but we'll handle it in handleConnect

  // 5. Check for starknet-specific properties
  if (wallet.starknet?.chainId) return wallet.starknet.chainId

  // 6. Selected account chainId
  if (wallet.selectedAccount?.chainId) return wallet.selectedAccount.chainId

  // 7. Infer from node URL as last resort
  if (wallet.provider?.channel?.nodeUrl) {
    const nodeUrl = wallet.provider.channel.nodeUrl
    if (nodeUrl.includes("sepolia") || nodeUrl.includes("testnet")) {
      return constants.StarknetChainId.SN_SEPOLIA
    }
    if (nodeUrl.includes("mainnet")) {
      return constants.StarknetChainId.SN_MAIN
    }
  }

  return null
}

// Helper function to create SDK-compatible provider
const createSdkProvider = (
  wallet: any,
  chainId: string | null,
  accountAddress: string
) => {
  const baseProvider = {
    ...wallet,
    chainId: chainId,
  }

  // Ensure account property exists with address
  if (wallet.account && wallet.account.address) {
    return baseProvider
  } else if (wallet.account) {
    return {
      ...baseProvider,
      account: {
        ...wallet.account,
        address: accountAddress,
      },
    }
  } else {
    return {
      ...baseProvider,
      account: {
        address: accountAddress,
      },
    }
  }
}

// Custom hook to use the context
export const useStarknetWallet = () => {
  const context = useContext(StarknetWalletContext)
  if (!context) {
    throw new Error(
      "useStarknetWallet must be used within StarknetWalletProvider"
    )
  }
  return context
}

interface StarknetWalletProviderProps {
  children: React.ReactNode
}

export const StarknetWalletProvider: React.FC<StarknetWalletProviderProps> = ({
  children,
}) => {
  const [account, setAccount] = useState<string | null>(null)
  const [provider, setProvider] = useState<any | null>(null)
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [walletName, setWalletName] = useState<string | null>(null)
  const [walletIcon, setWalletIcon] = useState<string | null>(null)
  const [currentWallet, setCurrentWallet] = useState<any | null>(null)

  // Remove connectors array since starknetkit handles this internally

  // Available wallets - simplified info for UI
  const availableWallets = useMemo(
    () => [
      {
        id: "argent-x",
        name: "Argent X",
        icon: "/argent-x-icon.svg",
      },
      {
        id: "braavos",
        name: "Braavos",
        icon: "/braavos-icon.svg",
      },
      {
        id: "argent-web",
        name: "Argent Web Wallet",
        icon: "/argent-web-icon.svg",
      },
    ],
    []
  )

  // Connect wallet function
  const handleConnect = useCallback(async () => {
    try {
      setConnecting(true)
      setError(null)

      // Get starknetkit module
      const { connect } = await getStarknetKit()

      // Use starknetkit's connect with modal and custom dApp name
      const result = await connect({
        modalMode: "alwaysAsk",
        dappName: "StarkNet",
        modalTheme: "dark",
      })

      if (result) {
        const { wallet, connectorData } = result

        if (wallet && connectorData) {
          const address = connectorData.account
          if (!address) {
            throw new Error("Failed to get wallet address")
          }

          // Extract chain ID using helper function
          let chainId = extractChainIdFromWallet(wallet)
          console.log("Initial chain ID:", chainId)

          // If no chain ID found, try to get it from the provider's RPC
          if (!chainId && wallet.provider) {
            try {
              // Some wallets need a moment to establish connection
              if (
                wallet.provider.getChainId &&
                typeof wallet.provider.getChainId === "function"
              ) {
                const rpcChainId = await wallet.provider.getChainId()
                if (rpcChainId) {
                  chainId = rpcChainId
                  console.log("Got chain ID from RPC call:", chainId)
                }
              }
            } catch (e) {
              console.warn("Failed to get chain ID from RPC:", e)
            }
          }

          console.log("Final chain ID:", chainId)

          // Check network compatibility
          const expectedChainId = getExpectedStarknetChainId()
          if (chainId && chainId !== expectedChainId) {
            console.warn(
              `Network mismatch: Expected ${expectedChainId} but wallet is on ${chainId}. Please manually switch to the correct network in your wallet.`
            )
          }

          // Create SDK-compatible provider
          const sdkProvider = createSdkProvider(wallet, chainId, address)
          setProvider(sdkProvider)
          setAccount(address)
          setConnected(true)
          setCurrentWallet(wallet) // Store the original wallet object

          // Store wallet info for UI
          const data = connectorData as any
          setWalletName(data.name || "Unknown Wallet")
          setWalletIcon(data.icon || "")

          // Store for auto-reconnect
          localStorage.setItem(STARKNET_WALLET_KEY, address)
          localStorage.setItem(STARKNET_LAST_WALLET, data.id || "")

          // Set up event listeners
          if (wallet.on) {
            wallet.on("accountsChanged", (accounts?: string[]) => {
              if (accounts && accounts.length > 0) {
                setAccount(accounts[0])
              } else {
                // User disconnected from wallet
                handleDisconnect()
              }
            })

            wallet.on("networkChanged", (newChainId?: string) => {
              // Update the provider with the new chain ID
              if (newChainId) {
                setProvider((prevProvider: any) => {
                  if (prevProvider) {
                    return {
                      ...prevProvider,
                      chainId: newChainId,
                    }
                  }
                  return prevProvider
                })
              }
            })
          }
        }
      }
    } catch (err) {
      console.error("Error connecting Starknet wallet:", err)
      setError(err as Error)
    } finally {
      setConnecting(false)
    }
  }, [])

  // Disconnect wallet function
  const handleDisconnect = useCallback(async () => {
    try {
      const { disconnect } = await getStarknetKit()
      await disconnect({ clearLastWallet: true })

      // Clean up state
      setAccount(null)
      setProvider(null)
      setConnected(false)
      setWalletName(null)
      setWalletIcon(null)
      setError(null)
      setCurrentWallet(null)

      // Clear stored wallet info
      localStorage.removeItem(STARKNET_WALLET_KEY)
      localStorage.removeItem(STARKNET_LAST_WALLET)
    } catch (err) {
      console.error("Error disconnecting Starknet wallet:", err)
      setError(err as Error)
    }
  }, [])

  // Switch network function
  const switchNetwork = useCallback(
    async (targetChainId: string) => {
      if (!currentWallet || !connected) {
        throw new Error("No wallet connected")
      }

      try {
        // Try different methods to switch network
        if (currentWallet.request) {
          await currentWallet.request({
            type: "wallet_switchStarknetChain",
            params: {
              chainId: targetChainId,
            },
          })
        } else if (currentWallet.wallet?.request) {
          await currentWallet.wallet.request({
            type: "wallet_switchStarknetChain",
            params: {
              chainId: targetChainId,
            },
          })
        } else {
          throw new Error("Wallet does not support network switching")
        }

        // Update the provider with new chain ID
        if (provider) {
          const updatedProvider = {
            ...provider,
            chainId: targetChainId,
          }
          setProvider(updatedProvider)
        }
      } catch (error) {
        console.error("Failed to switch network:", error)
        throw error
      }
    },
    [currentWallet, connected, provider]
  )

  // Auto-reconnect on mount
  useEffect(() => {
    const storedAddress = localStorage.getItem(STARKNET_WALLET_KEY)
    const lastWallet = localStorage.getItem(STARKNET_LAST_WALLET)

    if (storedAddress && lastWallet) {
      // Attempt to reconnect
      getStarknetKit().then(({ connect }) => {
        connect({
          modalMode: "neverAsk",
          dappName: "StarkNet",
          modalTheme: "dark",
        })
          .then((result: any) => {
            if (result) {
              const { wallet, connectorData } = result

              if (
                wallet &&
                connectorData &&
                connectorData.account === storedAddress
              ) {
                // Successfully reconnected to the same account
                setProvider(wallet)
                setAccount(connectorData.account)
                setConnected(true)
                const data = connectorData as any
                setWalletName(data.name || "Unknown Wallet")
                setWalletIcon(data.icon || "")

                // Set up event listeners
                if (wallet.on) {
                  wallet.on("accountsChanged", (accounts?: string[]) => {
                    if (accounts && accounts.length > 0) {
                      setAccount(accounts[0])
                    } else {
                      handleDisconnect()
                    }
                  })

                  wallet.on("networkChanged", (chainId?: string) => {
                    // Network changed event
                  })
                }
              } else {
                // Different account or failed to reconnect - clear storage
                localStorage.removeItem(STARKNET_WALLET_KEY)
                localStorage.removeItem(STARKNET_LAST_WALLET)
              }
            }
          })
          .catch((err: any) => {
            console.error("Auto-reconnect failed:", err)
            // Clear storage on error
            localStorage.removeItem(STARKNET_WALLET_KEY)
            localStorage.removeItem(STARKNET_LAST_WALLET)
          })
      })
    }
  }, [handleDisconnect])

  const contextValue: StarknetWalletContextValue = {
    connect: handleConnect,
    disconnect: handleDisconnect,
    account,
    provider,
    connected,
    connecting,
    error,
    availableWallets,
    walletName,
    walletIcon,
    switchNetwork,
    currentWallet,
  }

  return (
    <StarknetWalletContext.Provider value={contextValue}>
      {children}
    </StarknetWalletContext.Provider>
  )
}
