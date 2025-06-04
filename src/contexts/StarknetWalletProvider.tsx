import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react"
import { connect, disconnect } from "starknetkit"
import { StarknetConfig, mainnet, sepolia } from "@starknet-react/core"
import { StarknetProvider } from "@starknet-react/core"
import { InjectedConnector } from "starknetkit/injected"
import { ArgentMobileConnector } from "starknetkit/argentMobile"
import { WebWalletConnector } from "starknetkit/webwallet"
import { constants } from "starknet"

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
  ethereumChainId?: number // To determine which Starknet network to use
}

// Inner provider that uses the starknet-react hooks
const InnerStarknetProvider: React.FC<StarknetWalletProviderProps> = ({
  children,
  ethereumChainId,
}) => {
  const [account, setAccount] = useState<string | null>(null)
  const [provider, setProvider] = useState<any | null>(null)
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [walletName, setWalletName] = useState<string | null>(null)
  const [walletIcon, setWalletIcon] = useState<string | null>(null)

  // Determine network based on Ethereum chain ID
  const starknetChainId = useMemo(() => {
    // Map Ethereum chain IDs to Starknet chain IDs
    if (ethereumChainId === 1) {
      return constants.StarknetChainId.SN_MAIN
    } else if (ethereumChainId === 11155111) {
      return constants.StarknetChainId.SN_SEPOLIA
    }
    // Default to mainnet
    return constants.StarknetChainId.SN_MAIN
  }, [ethereumChainId])

  // Available wallet connectors
  const availableWallets = useMemo(
    () => [
      {
        id: "argent-x",
        name: "Argent X",
        icon: "/argent-x-icon.svg", // You'll need to add this icon
        connector: new InjectedConnector({ options: { id: "argentX" } }),
      },
      {
        id: "braavos",
        name: "Braavos",
        icon: "/braavos-icon.svg", // You'll need to add this icon
        connector: new InjectedConnector({ options: { id: "braavos" } }),
      },
      {
        id: "argent-mobile",
        name: "Argent Mobile",
        icon: "/argent-mobile-icon.svg",
        connector: new ArgentMobileConnector(),
      },
      {
        id: "argent-web",
        name: "Argent Web Wallet",
        icon: "/argent-web-icon.svg",
        connector: new WebWalletConnector({ url: "https://web.argent.xyz" }),
      },
    ],
    []
  )

  // Connect wallet function
  const handleConnect = useCallback(async () => {
    try {
      setConnecting(true)
      setError(null)

      // Use starknetkit's connect modal
      const result = await connect({
        modalMode: "alwaysAsk",
        modalTheme: "dark",
        webWalletUrl: "https://web.argent.xyz",
        argentMobileOptions: {
          dappName: "Threshold Network",
          url: window.location.href,
        },
      })

      if (result) {
        const { wallet, connectorData } = result

        // Extract address based on provider type
        let address: string | null = null
        if (wallet && "selectedAddress" in wallet) {
          address = wallet.selectedAddress
        } else if (wallet && "account" in wallet && wallet.account?.address) {
          address = wallet.account.address
        }

        if (address) {
          setAccount(address)
          setProvider(wallet)
          setConnected(true)
          setWalletName(connectorData?.name || "Unknown Wallet")
          setWalletIcon(connectorData?.icon || "")

          // Store wallet info for auto-reconnect
          localStorage.setItem(STARKNET_WALLET_KEY, address)
          localStorage.setItem(STARKNET_LAST_WALLET, connectorData?.id || "")
        } else {
          throw new Error("Failed to get wallet address")
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
        webWalletUrl: "https://web.argent.xyz",
      })
        .then((result) => {
          if (result) {
            const { wallet, connectorData } = result

            // Extract address
            let address: string | null = null
            if (wallet && "selectedAddress" in wallet) {
              address = wallet.selectedAddress
            } else if (
              wallet &&
              "account" in wallet &&
              wallet.account?.address
            ) {
              address = wallet.account.address
            }

            if (address === storedAddress) {
              setAccount(address)
              setProvider(wallet)
              setConnected(true)
              setWalletName(connectorData?.name || "Unknown Wallet")
              setWalletIcon(connectorData?.icon || "")
            } else {
              // Address mismatch, clear storage
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
  }, [])

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

// Outer provider that configures StarknetConfig
export const StarknetWalletProvider: React.FC<StarknetWalletProviderProps> = ({
  children,
  ethereumChainId,
}) => {
  // Determine which chain to use based on Ethereum chain ID
  const chain = useMemo(() => {
    if (ethereumChainId === 11155111) {
      return sepolia
    }
    return mainnet
  }, [ethereumChainId])

  // Configure connectors
  const connectors = useMemo(
    () => [
      new InjectedConnector({ options: { id: "argentX" } }),
      new InjectedConnector({ options: { id: "braavos" } }),
      new ArgentMobileConnector(),
      new WebWalletConnector({ url: "https://web.argent.xyz" }),
    ],
    []
  )

  return (
    <StarknetConfig
      chains={[chain]}
      connectors={connectors}
      autoConnect={false}
    >
      <StarknetProvider>
        <InnerStarknetProvider ethereumChainId={ethereumChainId}>
          {children}
        </InnerStarknetProvider>
      </StarknetProvider>
    </StarknetConfig>
  )
}
