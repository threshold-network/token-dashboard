import { renderHook } from "@testing-library/react-hooks"
import { render, screen } from "@testing-library/react"
import {
  mockStarknetWalletData,
  mockStarknetProvider,
  createMockStarknetContextValue,
  MockStarknetWalletProvider,
  useMockStarknetWallet,
  createConnectedStarknetState,
  createErrorStarknetState,
  createConnectingStarknetState,
  mockStarknetKit,
  mockWindowStarknet,
  cleanupStarknetMocks,
  setupStarknetTest,
  mockStarknetConnectionFlow,
  mockUseStarknetConnection,
  renderWithStarknetProvider,
} from "../starknet-test-utils"

describe("Starknet Test Utilities", () => {
  afterEach(() => {
    cleanupStarknetMocks()
  })

  describe("Mock Data Constants", () => {
    it("should provide valid mock wallet data", () => {
      expect(mockStarknetWalletData.validAddress).toMatch(/^0x[a-fA-F0-9]{64}$/)
      expect(mockStarknetWalletData.shortAddress).toBe("0x049d3657...9e004dc7")
      expect(mockStarknetWalletData.argentXWallet).toEqual({
        id: "argentX",
        name: "Argent X",
        icon: "argentx-icon-url",
      })
    })

    it("should provide valid mock provider", () => {
      expect(mockStarknetProvider).toHaveProperty("address")
      expect(mockStarknetProvider).toHaveProperty("isConnected", true)
      expect(mockStarknetProvider).toHaveProperty("chainId")
      expect(mockStarknetProvider.account).toHaveProperty("address")
    })
  })

  describe("createMockStarknetContextValue", () => {
    it("should create default mock context value", () => {
      const contextValue = createMockStarknetContextValue()

      expect(contextValue.connect).toBeDefined()
      expect(contextValue.disconnect).toBeDefined()
      expect(contextValue.account).toBeNull()
      expect(contextValue.connected).toBe(false)
      expect(contextValue.availableWallets).toHaveLength(3)
    })

    it("should allow overriding values", () => {
      const contextValue = createMockStarknetContextValue({
        connected: true,
        account: mockStarknetWalletData.validAddress,
      })

      expect(contextValue.connected).toBe(true)
      expect(contextValue.account).toBe(mockStarknetWalletData.validAddress)
    })
  })

  describe("MockStarknetWalletProvider", () => {
    it("should provide context to children", () => {
      const TestComponent = () => {
        const context = useMockStarknetWallet()
        return <div>{context.connected ? "Connected" : "Disconnected"}</div>
      }

      render(
        <MockStarknetWalletProvider>
          <TestComponent />
        </MockStarknetWalletProvider>
      )

      expect(screen.getByText("Disconnected")).toBeInTheDocument()
    })

    it("should accept custom values", () => {
      const TestComponent = () => {
        const context = useMockStarknetWallet()
        return <div>{context.account || "No account"}</div>
      }

      render(
        <MockStarknetWalletProvider
          value={{ account: mockStarknetWalletData.validAddress }}
        >
          <TestComponent />
        </MockStarknetWalletProvider>
      )

      expect(
        screen.getByText(mockStarknetWalletData.validAddress)
      ).toBeInTheDocument()
    })

    it("should throw error when hook used outside provider", () => {
      const { result } = renderHook(() => useMockStarknetWallet())

      expect(result.error).toEqual(
        new Error(
          "useMockStarknetWallet must be used within MockStarknetWalletProvider"
        )
      )
    })
  })

  describe("State Creation Helpers", () => {
    it("should create connected state for Argent X", () => {
      const state = createConnectedStarknetState("argentX")

      expect(state.connected).toBe(true)
      expect(state.account).toBe(mockStarknetWalletData.validAddress)
      expect(state.provider).toBeDefined()
      expect(state.error).toBeNull()
    })

    it("should create connected state for Braavos", () => {
      const state = createConnectedStarknetState("braavos")

      expect(state.connected).toBe(true)
      expect(state.availableWallets?.[0]).toEqual(
        mockStarknetWalletData.braavosWallet
      )
    })

    it("should create error state", () => {
      const errorMessage = "Custom error"
      const state = createErrorStarknetState(errorMessage)

      expect(state.connected).toBe(false)
      expect(state.error?.message).toBe(errorMessage)
      expect(state.account).toBeNull()
    })

    it("should create connecting state", () => {
      const state = createConnectingStarknetState()

      expect(state.connecting).toBe(true)
      expect(state.connected).toBe(false)
      expect(state.account).toBeNull()
    })
  })

  describe("Window Mock Helpers", () => {
    it("should mock window.starknet objects", () => {
      const mock = mockWindowStarknet()

      expect(window).toHaveProperty("starknet_argentX")
      expect(window).toHaveProperty("starknet_braavos")
      expect(mock.enable).toBeDefined()
      expect(mock.isConnected).toBe(false)
    })

    it("should cleanup window mocks", () => {
      mockWindowStarknet()
      cleanupStarknetMocks()

      expect(window).not.toHaveProperty("starknet_argentX")
      expect(window).not.toHaveProperty("starknet_braavos")
    })
  })

  describe("Test Setup Helper", () => {
    it("should setup test environment", () => {
      const { windowMock, contextValue, cleanup } = setupStarknetTest()

      expect(windowMock).toBeDefined()
      expect(contextValue).toBeDefined()
      expect(cleanup).toBeDefined()
      expect(window).toHaveProperty("starknet_argentX")

      cleanup()
      expect(window).not.toHaveProperty("starknet_argentX")
    })
  })

  describe("Connection Flow Mock", () => {
    it("should mock successful connection", async () => {
      const contextValue = createMockStarknetContextValue()

      await mockStarknetConnectionFlow(contextValue, { shouldSucceed: true })

      await contextValue.connect()

      expect(contextValue.connected).toBe(true)
      expect(contextValue.account).toBe(mockStarknetWalletData.validAddress)
    })

    it("should mock failed connection", async () => {
      const contextValue = createMockStarknetContextValue()
      const errorMessage = "User rejected"

      await mockStarknetConnectionFlow(contextValue, {
        shouldSucceed: false,
        errorMessage,
      })

      await expect(contextValue.connect()).rejects.toThrow(errorMessage)
      expect(contextValue.error?.message).toBe(errorMessage)
    })
  })

  describe("Hook Mock", () => {
    it("should create mock hook return value", () => {
      const mockHook = mockUseStarknetConnection()

      expect(mockHook.isConnected).toBe(false)
      expect(mockHook.connect).toBeDefined()
      expect(mockHook.disconnect).toBeDefined()
    })

    it("should allow overriding hook values", () => {
      const mockHook = mockUseStarknetConnection({
        isConnected: true,
        address: mockStarknetWalletData.validAddress,
      })

      expect(mockHook.isConnected).toBe(true)
      expect(mockHook.address).toBe(mockStarknetWalletData.validAddress)
    })
  })

  describe("Render Helper", () => {
    it("should render with Starknet provider", () => {
      const TestComponent = () => {
        const context = useMockStarknetWallet()
        return <div>Wallets: {context.availableWallets.length}</div>
      }

      const { providerValue } = renderWithStarknetProvider(<TestComponent />)

      expect(screen.getByText("Wallets: 3")).toBeInTheDocument()
      expect(providerValue).toBeDefined()
    })

    it("should render with custom provider value", () => {
      const TestComponent = () => {
        const context = useMockStarknetWallet()
        return <div>{context.connected ? "Connected" : "Not connected"}</div>
      }

      renderWithStarknetProvider(<TestComponent />, {
        providerValue: { connected: true },
      })

      expect(screen.getByText("Connected")).toBeInTheDocument()
    })
  })

  describe("StarknetKit Mock", () => {
    it("should provide mock starknetkit functions", async () => {
      // Test that functions exist
      expect(mockStarknetKit.connect).toBeDefined()
      expect(mockStarknetKit.disconnect).toBeDefined()
      expect(mockStarknetKit.getAvailableWallets).toBeDefined()

      // Test that they are jest mocks
      expect(jest.isMockFunction(mockStarknetKit.connect)).toBe(true)
      expect(jest.isMockFunction(mockStarknetKit.disconnect)).toBe(true)
      expect(jest.isMockFunction(mockStarknetKit.getAvailableWallets)).toBe(
        true
      )

      // Test that connect can be configured
      mockStarknetKit.connect.mockResolvedValueOnce({
        wallet: mockStarknetWalletData.argentXWallet,
        connectorData: mockStarknetProvider,
      })

      const connectResult = await mockStarknetKit.connect()
      expect(connectResult).toEqual({
        wallet: mockStarknetWalletData.argentXWallet,
        connectorData: mockStarknetProvider,
      })

      // Test disconnect returns undefined
      const disconnectResult = await mockStarknetKit.disconnect()
      expect(disconnectResult).toBeUndefined()
    })
  })
})
