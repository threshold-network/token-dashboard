import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react"
import { connect, disconnect } from "starknetkit"

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
}

// Create the context
const StarknetWalletContext = createContext<
  StarknetWalletContextValue | undefined
>(undefined)

// Constants
const STARKNET_WALLET_KEY = "starknet-wallet"
const STARKNET_LAST_WALLET = "starknet-last-wallet"

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

      // Use starknetkit's connect with modal
      const result = await connect({
        modalMode: "alwaysAsk",
      })

      if (result) {
        const { wallet, connectorData } = result

        if (wallet && connectorData) {
          // Store wallet instance (this is the provider for SDK)
          setProvider(wallet)

          // Store account address
          const address = connectorData.account
          if (address) {
            setAccount(address)
            setConnected(true)

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

              wallet.on("networkChanged", (chainId?: string) => {
                console.log("Network changed to:", chainId)
                // You might want to handle network changes here
              })
            }
          } else {
            throw new Error("Failed to get wallet address")
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
      await disconnect({ clearLastWallet: true })

      // Clean up state
      setAccount(null)
      setProvider(null)
      setConnected(false)
      setWalletName(null)
      setWalletIcon(null)
      setError(null)

      // Clear stored wallet info
      localStorage.removeItem(STARKNET_WALLET_KEY)
      localStorage.removeItem(STARKNET_LAST_WALLET)
    } catch (err) {
      console.error("Error disconnecting Starknet wallet:", err)
      setError(err as Error)
    }
  }, [])

  // Auto-reconnect on mount
  useEffect(() => {
    const storedAddress = localStorage.getItem(STARKNET_WALLET_KEY)
    const lastWallet = localStorage.getItem(STARKNET_LAST_WALLET)

    if (storedAddress && lastWallet) {
      // Attempt to reconnect
      connect({
        modalMode: "neverAsk",
      })
        .then((result) => {
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
                  console.log("Network changed to:", chainId)
                })
              }
            } else {
              // Different account or failed to reconnect - clear storage
              localStorage.removeItem(STARKNET_WALLET_KEY)
              localStorage.removeItem(STARKNET_LAST_WALLET)
            }
          }
        })
        .catch((err) => {
          console.error("Auto-reconnect failed:", err)
          // Clear storage on error
          localStorage.removeItem(STARKNET_WALLET_KEY)
          localStorage.removeItem(STARKNET_LAST_WALLET)
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
  }

  return (
    <StarknetWalletContext.Provider value={contextValue}>
      {children}
    </StarknetWalletContext.Provider>
  )
}
