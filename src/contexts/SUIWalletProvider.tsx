import React, {
  FC,
  ReactNode,
  useState,
  useEffect,
  createContext,
  useContext,
} from "react"
import { getEnvVariable } from "../utils/getEnvVariable"
import { EnvVariable } from "../enums"
import { isMainnetChainId } from "../networks/utils"

// Create a simplified version that doesn't directly depend on @suiet/wallet-kit's components
// but still provides the interface needed by our components
type SUIWalletContextType = {
  connected: boolean
  account: { address: string } | null
  disconnect: () => Promise<void>
  select: (walletName?: string) => Promise<void>
}

const defaultContext: SUIWalletContextType = {
  connected: false,
  account: null,
  disconnect: async () => {},
  select: async () => {},
}

const SUIWalletContext = createContext<SUIWalletContextType>(defaultContext)

// Export a hook that our components can use
export const useWallet = () => useContext(SUIWalletContext)

interface SUIWalletProviderProps {
  children: ReactNode
}

// Create a simplified provider
const SUIWalletProvider: FC<SUIWalletProviderProps> = ({ children }) => {
  const [walletState, setWalletState] =
    useState<SUIWalletContextType>(defaultContext)

  const defaultEthereumChainId = getEnvVariable(
    EnvVariable.DEFAULT_PROVIDER_CHAIN_ID
  )

  const network = isMainnetChainId(defaultEthereumChainId)
    ? "mainnet"
    : "testnet"

  // Set up simplified wallet interface
  useEffect(() => {
    let intervalId: number | undefined

    // Check if window.suiet is available (browser extension)
    const checkWallet = () => {
      if (
        typeof window !== "undefined" &&
        window.suiet &&
        window.suiet.getAccounts
      ) {
        try {
          window.suiet
            .getAccounts()
            .then((accounts: string[]) => {
              if (accounts && accounts.length > 0) {
                setWalletState((prev) => ({
                  ...prev,
                  connected: true,
                  account: { address: accounts[0] },
                }))
              }
            })
            .catch((err: any) => {
              console.error("Error checking SUI wallet:", err)
            })
        } catch (error) {
          console.error("Error accessing SUI wallet:", error)
        }
      }
    }

    // Don't use interval in production builds for better performance
    if (process.env.NODE_ENV !== "production") {
      intervalId = window.setInterval(checkWallet, 1000) as unknown as number
    }

    checkWallet()

    const disconnect = async () => {
      if (window.suiet && window.suiet.disconnect) {
        try {
          await window.suiet.disconnect()
          setWalletState((prev) => ({
            ...prev,
            connected: false,
            account: null,
          }))
        } catch (error) {
          console.error("Failed to disconnect SUI wallet:", error)
        }
      }
    }

    const select = async (walletName?: string) => {
      if (window.suiet && window.suiet.connect) {
        try {
          await window.suiet.connect()
          const accounts = await window.suiet.getAccounts()
          if (accounts && accounts.length > 0) {
            setWalletState((prev) => ({
              ...prev,
              connected: true,
              account: { address: accounts[0] },
            }))
          }
        } catch (error) {
          console.error("Failed to connect SUI wallet:", error)
        }
      } else {
        alert(
          "No SUI wallet extension detected. Please install a SUI wallet extension first."
        )
      }
    }

    setWalletState((prev) => ({
      ...prev,
      disconnect,
      select,
    }))

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId)
      }
    }
  }, [])

  return (
    <SUIWalletContext.Provider value={walletState}>
      {children}
    </SUIWalletContext.Provider>
  )
}

// Add TypeScript interface for window.suiet
declare global {
  interface Window {
    suiet?: {
      getAccounts: () => Promise<string[]>
      connect: () => Promise<void>
      disconnect: () => Promise<void>
    }
  }
}

export default SUIWalletProvider
