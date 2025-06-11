import React, { FC, ReactNode, createContext, useContext } from "react"

// Mock wallet data constants
export const mockStarknetWalletData = {
  validAddress:
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  shortAddress: "0x049d3657...9e004dc7",
  invalidAddress: "0xinvalid",
  argentXWallet: {
    id: "argentX",
    name: "Argent X",
    icon: "argentx-icon-url",
  },
  braavosWallet: {
    id: "braavos",
    name: "Braavos",
    icon: "braavos-icon-url",
  },
  webWallet: {
    id: "webwallet",
    name: "Web Wallet",
    icon: "webwallet-icon-url",
  },
}

// Mock provider data
export const mockStarknetProvider = {
  address: mockStarknetWalletData.validAddress,
  isConnected: true,
  chainId: "0x534e5f4d41494e", // mainnet
  account: {
    address: mockStarknetWalletData.validAddress,
  },
}

// Mock context value interface
export interface MockStarknetContextValue {
  connect: jest.Mock
  disconnect: jest.Mock
  account: string | null
  provider: any | null
  connected: boolean
  connecting: boolean
  error: Error | null
  availableWallets: any[]
}

// Default mock context value
export const createMockStarknetContextValue = (
  overrides?: Partial<MockStarknetContextValue>
): MockStarknetContextValue => ({
  connect: jest.fn().mockResolvedValue(undefined),
  disconnect: jest.fn(),
  account: null,
  provider: null,
  connected: false,
  connecting: false,
  error: null,
  availableWallets: [
    mockStarknetWalletData.argentXWallet,
    mockStarknetWalletData.braavosWallet,
    mockStarknetWalletData.webWallet,
  ],
  ...overrides,
})

// Mock context
const MockStarknetWalletContext = createContext<
  MockStarknetContextValue | undefined
>(undefined)

// Mock provider component
export const MockStarknetWalletProvider: FC<{
  children: ReactNode
  value?: Partial<MockStarknetContextValue>
}> = ({ children, value }) => {
  const defaultValue = createMockStarknetContextValue(value)

  return (
    <MockStarknetWalletContext.Provider value={defaultValue}>
      {children}
    </MockStarknetWalletContext.Provider>
  )
}

// Mock hook
export const useMockStarknetWallet = () => {
  const context = useContext(MockStarknetWalletContext)
  if (!context) {
    throw new Error(
      "useMockStarknetWallet must be used within MockStarknetWalletProvider"
    )
  }
  return context
}

// Helper to create connected state
export const createConnectedStarknetState = (
  walletType: "argentX" | "braavos" = "argentX"
): Partial<MockStarknetContextValue> => {
  const wallet =
    walletType === "argentX"
      ? mockStarknetWalletData.argentXWallet
      : mockStarknetWalletData.braavosWallet

  return {
    account: mockStarknetWalletData.validAddress,
    provider: mockStarknetProvider,
    connected: true,
    connecting: false,
    error: null,
    availableWallets: [wallet],
  }
}

// Helper to create error state
export const createErrorStarknetState = (
  error: string = "Connection failed"
): Partial<MockStarknetContextValue> => ({
  account: null,
  provider: null,
  connected: false,
  connecting: false,
  error: new Error(error),
  availableWallets: [],
})

// Helper to create connecting state
export const createConnectingStarknetState =
  (): Partial<MockStarknetContextValue> => ({
    account: null,
    provider: null,
    connected: false,
    connecting: true,
    error: null,
  })

// Mock starknetkit module
export const mockStarknetKit = {
  connect: jest.fn(),
  disconnect: jest.fn().mockResolvedValue(undefined),
  getAvailableWallets: jest
    .fn()
    .mockReturnValue([
      mockStarknetWalletData.argentXWallet,
      mockStarknetWalletData.braavosWallet,
    ]),
}

// Helper to mock window.starknet_argentX
export const mockWindowStarknet = () => {
  const mock = {
    isConnected: false,
    enable: jest.fn(),
    account: null,
    provider: {
      request: jest.fn(),
    },
  }

  // @ts-ignore
  window.starknet_argentX = mock
  // @ts-ignore
  window.starknet_braavos = mock

  return mock
}

// Cleanup helper
export const cleanupStarknetMocks = () => {
  // @ts-ignore
  delete window.starknet_argentX
  // @ts-ignore
  delete window.starknet_braavos
  jest.clearAllMocks()
}

// Test setup helper
export const setupStarknetTest = () => {
  const windowMock = mockWindowStarknet()
  const contextValue = createMockStarknetContextValue()

  return {
    windowMock,
    contextValue,
    cleanup: cleanupStarknetMocks,
  }
}

// Mock connection flow
export const mockStarknetConnectionFlow = async (
  contextValue: MockStarknetContextValue,
  options: {
    shouldSucceed?: boolean
    walletType?: "argentX" | "braavos"
    errorMessage?: string
  } = {}
) => {
  const { shouldSucceed = true, walletType = "argentX", errorMessage } = options

  if (shouldSucceed) {
    contextValue.connect.mockImplementation(async () => {
      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Update mock to connected state
      Object.assign(contextValue, createConnectedStarknetState(walletType))
    })
  } else {
    contextValue.connect.mockRejectedValue(
      new Error(errorMessage || "Connection rejected")
    )
    Object.assign(contextValue, createErrorStarknetState(errorMessage))
  }
}

// Mock useStarknetConnection hook
export const mockUseStarknetConnection = (overrides?: Partial<any>) => ({
  isConnected: false,
  isConnecting: false,
  address: null,
  provider: null,
  walletName: null,
  walletIcon: null,
  connect: jest.fn(),
  disconnect: jest.fn(),
  chainId: null,
  availableWallets: [],
  error: null,
  ...overrides,
})

// Render helper with providers
export const renderWithStarknetProvider = (
  ui: React.ReactElement,
  options?: {
    providerValue?: Partial<MockStarknetContextValue>
    // Add other provider options as needed
  }
) => {
  const { providerValue } = options || {}

  return {
    ...render(
      <MockStarknetWalletProvider value={providerValue}>
        {ui}
      </MockStarknetWalletProvider>
    ),
    providerValue: createMockStarknetContextValue(providerValue),
  }
}

// Re-export React Testing Library render for convenience
import { render } from "@testing-library/react"
export { render }

// Export alias for backward compatibility
export { MockStarknetWalletProvider as MockStarknetProvider }
