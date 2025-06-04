import { renderHook } from "@testing-library/react-hooks"
import { ChainName } from "../../threshold-ts/types"
import { useNonEVMConnection } from "../useNonEVMConnection"
import { useStarknetConnection } from "../useStarknetConnection"

// Mock the Starknet connection hook
jest.mock("../useStarknetConnection")

// Add SDK mocks to avoid setupTests issues
jest.mock("@keep-network/tbtc-v2.ts/dist/src/lib/bitcoin", () => ({}))
jest.mock("@keep-network/tbtc-v2.ts/dist/src/lib/ethereum", () => ({}))
jest.mock("@keep-network/tbtc-v2.ts", () => ({}))

describe("useNonEVMConnection", () => {
  const mockUseStarknetConnection =
    useStarknetConnection as jest.MockedFunction<typeof useStarknetConnection>

  const mockStarknetProvider = {
    account: {
      address:
        "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("when no non-EVM wallet is connected", () => {
    beforeEach(() => {
      mockUseStarknetConnection.mockReturnValue({
        isConnected: false,
        isConnecting: false,
        address: null,
        provider: null,
        walletName: null,
        walletIcon: null,
        chainId: null,
        availableWallets: [],
        error: null,
        connect: jest.fn(),
        disconnect: jest.fn(),
      })
    })

    it("should return null values for all connection properties", () => {
      const { result } = renderHook(() => useNonEVMConnection())

      expect(result.current.nonEVMChainName).toBeNull()
      expect(result.current.nonEVMPublicKey).toBeNull()
      expect(result.current.nonEVMProvider).toBeNull()
      expect(result.current.isNonEVMActive).toBe(false)
      expect(result.current.connectedWalletName).toBeNull()
      expect(result.current.connectedWalletIcon).toBeNull()
      expect(result.current.isNonEVMConnecting).toBe(false)
      expect(result.current.isNonEVMDisconnecting).toBe(false)
    })

    it("should provide a disconnect function that does nothing", () => {
      const { result } = renderHook(() => useNonEVMConnection())

      // Should not throw when called
      expect(() => result.current.disconnectNonEVMWallet()).not.toThrow()
    })
  })

  describe("when Starknet wallet is connected", () => {
    const mockDisconnect = jest.fn()

    beforeEach(() => {
      mockUseStarknetConnection.mockReturnValue({
        isConnected: true,
        isConnecting: false,
        address:
          "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
        provider: mockStarknetProvider,
        walletName: "Argent X",
        walletIcon: "argent-icon-url",
        chainId: "0x534e5f4d41494e",
        availableWallets: [],
        error: null,
        connect: jest.fn(),
        disconnect: mockDisconnect,
      })
    })

    it("should return Starknet connection data", () => {
      const { result } = renderHook(() => useNonEVMConnection())

      expect(result.current.nonEVMChainName).toBe(ChainName.Starknet)
      expect(result.current.nonEVMPublicKey).toBe(
        "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
      )
      expect(result.current.nonEVMProvider).toBe(mockStarknetProvider)
      expect(result.current.isNonEVMActive).toBe(true)
      expect(result.current.connectedWalletName).toBe("Argent X")
      expect(result.current.connectedWalletIcon).toBe("argent-icon-url")
    })

    it("should call Starknet disconnect when disconnectNonEVMWallet is called", () => {
      const { result } = renderHook(() => useNonEVMConnection())

      result.current.disconnectNonEVMWallet()

      expect(mockDisconnect).toHaveBeenCalledTimes(1)
    })
  })

  describe("when Starknet wallet is connecting", () => {
    beforeEach(() => {
      mockUseStarknetConnection.mockReturnValue({
        isConnected: false,
        isConnecting: true,
        address: null,
        provider: null,
        walletName: null,
        walletIcon: null,
        chainId: null,
        availableWallets: [],
        error: null,
        connect: jest.fn(),
        disconnect: jest.fn(),
      })
    })

    it("should return connecting state", () => {
      const { result } = renderHook(() => useNonEVMConnection())

      expect(result.current.isNonEVMConnecting).toBe(true)
      expect(result.current.isNonEVMActive).toBe(false)
      expect(result.current.nonEVMChainName).toBeNull()
    })
  })

  describe("state transitions", () => {
    it("should update when Starknet connection state changes", () => {
      const mockDisconnect = jest.fn()

      // Start disconnected
      mockUseStarknetConnection.mockReturnValue({
        isConnected: false,
        isConnecting: false,
        address: null,
        provider: null,
        walletName: null,
        walletIcon: null,
        chainId: null,
        availableWallets: [],
        error: null,
        connect: jest.fn(),
        disconnect: mockDisconnect,
      })

      const { result, rerender } = renderHook(() => useNonEVMConnection())

      expect(result.current.isNonEVMActive).toBe(false)

      // Update to connected
      mockUseStarknetConnection.mockReturnValue({
        isConnected: true,
        isConnecting: false,
        address:
          "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
        provider: mockStarknetProvider,
        walletName: "Braavos",
        walletIcon: "braavos-icon-url",
        chainId: "0x534e5f5345504f4c4941",
        availableWallets: [],
        error: null,
        connect: jest.fn(),
        disconnect: mockDisconnect,
      })

      rerender()

      expect(result.current.isNonEVMActive).toBe(true)
      expect(result.current.nonEVMChainName).toBe(ChainName.Starknet)
      expect(result.current.connectedWalletName).toBe("Braavos")
    })
  })

  describe("extensibility", () => {
    it("should be designed to support future non-EVM chains", () => {
      // This test documents the expected behavior when other chains are added
      // Currently only Starknet is supported, but the hook is designed to handle multiple chains

      // When Solana/Sui support is added:
      // 1. Import the new connection hook
      // 2. Add chain detection logic to determine active chain
      // 3. Update disconnect function to handle the new chain
      // 4. The API should remain the same for consumers

      const { result } = renderHook(() => useNonEVMConnection())

      // The hook returns a chain-agnostic interface
      expect(result.current).toHaveProperty("nonEVMChainName")
      expect(result.current).toHaveProperty("nonEVMPublicKey")
      expect(result.current).toHaveProperty("nonEVMProvider")
      expect(result.current).toHaveProperty("isNonEVMActive")
      expect(result.current).toHaveProperty("disconnectNonEVMWallet")
    })
  })
})
