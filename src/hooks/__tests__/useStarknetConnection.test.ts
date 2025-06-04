import { renderHook } from "@testing-library/react-hooks"
import {
  useStarknetConnection,
  extractStarknetAddress,
  isProviderReady,
} from "../useStarknetConnection"
import { useStarknetWallet } from "../../contexts/StarknetWalletProvider"
import { constants } from "starknet"

// Mock the context
jest.mock("../../contexts/StarknetWalletProvider", () => ({
  useStarknetWallet: jest.fn(),
}))

// Mock starknet
jest.mock("starknet", () => ({
  constants: {
    StarknetChainId: {
      SN_MAIN: "0x534e5f4d41494e",
      SN_SEPOLIA: "0x534e5f5345504f4c4941",
    },
  },
}))

describe("useStarknetConnection", () => {
  const mockAddress =
    "0x04a909347487d909a6629b56880e6e03ad3859e772048c4481f3fba88ea02c32f"
  const mockConnect = jest.fn()
  const mockDisconnect = jest.fn()

  const defaultMockContext = {
    connect: mockConnect,
    disconnect: mockDisconnect,
    account: null,
    provider: null,
    connected: false,
    connecting: false,
    error: null,
    availableWallets: [],
    walletName: null,
    walletIcon: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useStarknetWallet as jest.Mock).mockReturnValue(defaultMockContext)
  })

  it("should return disconnected state by default", () => {
    const { result } = renderHook(() => useStarknetConnection())

    expect(result.current.isConnected).toBe(false)
    expect(result.current.isConnecting).toBe(false)
    expect(result.current.address).toBeNull()
    expect(result.current.provider).toBeNull()
    expect(result.current.walletName).toBeNull()
    expect(result.current.walletIcon).toBeNull()
    expect(result.current.chainId).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.availableWallets).toEqual([])
  })

  it("should return connected state when wallet is connected", () => {
    const mockProvider = {
      chainId: constants.StarknetChainId.SN_MAIN,
      account: { address: mockAddress },
    }

    ;(useStarknetWallet as jest.Mock).mockReturnValue({
      ...defaultMockContext,
      account: mockAddress,
      provider: mockProvider,
      connected: true,
      walletName: "Argent X",
      walletIcon: "/argent-x-icon.svg",
      availableWallets: [{ id: "argentX", name: "Argent X" }],
    })

    const { result } = renderHook(() => useStarknetConnection())

    expect(result.current.isConnected).toBe(true)
    expect(result.current.address).toBe(mockAddress)
    expect(result.current.provider).toBe(mockProvider)
    expect(result.current.walletName).toBe("Argent X")
    expect(result.current.walletIcon).toBe("/argent-x-icon.svg")
    expect(result.current.chainId).toBe(constants.StarknetChainId.SN_MAIN)
    expect(result.current.availableWallets).toHaveLength(1)
  })

  it("should return connecting state", () => {
    ;(useStarknetWallet as jest.Mock).mockReturnValue({
      ...defaultMockContext,
      connecting: true,
    })

    const { result } = renderHook(() => useStarknetConnection())

    expect(result.current.isConnecting).toBe(true)
    expect(result.current.isConnected).toBe(false)
  })

  it("should return error state", () => {
    const mockError = new Error("Connection failed")

    ;(useStarknetWallet as jest.Mock).mockReturnValue({
      ...defaultMockContext,
      error: mockError,
    })

    const { result } = renderHook(() => useStarknetConnection())

    expect(result.current.error).toBe(mockError)
  })

  it("should call connect function", async () => {
    const { result } = renderHook(() => useStarknetConnection())

    await result.current.connect()

    expect(mockConnect).toHaveBeenCalledTimes(1)
  })

  it("should call disconnect function", () => {
    const { result } = renderHook(() => useStarknetConnection())

    result.current.disconnect()

    expect(mockDisconnect).toHaveBeenCalledTimes(1)
  })

  it("should get chainId from provider.account.chainId when provider.chainId is not available", () => {
    const mockProvider = {
      account: {
        address: mockAddress,
        chainId: constants.StarknetChainId.SN_SEPOLIA,
      },
    }

    ;(useStarknetWallet as jest.Mock).mockReturnValue({
      ...defaultMockContext,
      provider: mockProvider,
      connected: true,
    })

    const { result } = renderHook(() => useStarknetConnection())

    expect(result.current.chainId).toBe(constants.StarknetChainId.SN_SEPOLIA)
  })

  it("should default to mainnet chainId when unable to determine from provider", () => {
    const mockProvider = {} // Provider without chainId

    ;(useStarknetWallet as jest.Mock).mockReturnValue({
      ...defaultMockContext,
      provider: mockProvider,
      connected: true,
    })

    const { result } = renderHook(() => useStarknetConnection())

    expect(result.current.chainId).toBe(constants.StarknetChainId.SN_MAIN)
  })
})

describe("extractStarknetAddress", () => {
  const mockAddress =
    "0x04a909347487d909a6629b56880e6e03ad3859e772048c4481f3fba88ea02c32f"

  it("should return null for null provider", () => {
    expect(extractStarknetAddress(null)).toBeNull()
  })

  it("should return null for undefined provider", () => {
    expect(extractStarknetAddress(undefined)).toBeNull()
  })

  it("should extract address from Account object", () => {
    const provider = { address: mockAddress }
    expect(extractStarknetAddress(provider)).toBe(mockAddress)
  })

  it("should extract address from Provider with connected account", () => {
    const provider = {
      account: { address: mockAddress },
    }
    expect(extractStarknetAddress(provider)).toBe(mockAddress)
  })

  it("should extract selectedAddress when available", () => {
    const provider = { selectedAddress: mockAddress }
    expect(extractStarknetAddress(provider)).toBe(mockAddress)
  })

  it("should prioritize direct address property over others", () => {
    const provider = {
      address: mockAddress,
      account: { address: "0xdifferent" },
      selectedAddress: "0xanother",
    }
    expect(extractStarknetAddress(provider)).toBe(mockAddress)
  })

  it("should return null for provider without address", () => {
    const provider = { someOtherProp: "value" }
    expect(extractStarknetAddress(provider)).toBeNull()
  })

  it("should return null for non-string address", () => {
    const provider = { address: 123 }
    expect(extractStarknetAddress(provider)).toBeNull()
  })
})

describe("isProviderReady", () => {
  const mockAddress =
    "0x04a909347487d909a6629b56880e6e03ad3859e772048c4481f3fba88ea02c32f"

  it("should return false for null provider", () => {
    expect(isProviderReady(null)).toBe(false)
  })

  it("should return false for undefined provider", () => {
    expect(isProviderReady(undefined)).toBe(false)
  })

  it("should return true for provider with extractable address", () => {
    const provider = { address: mockAddress }
    expect(isProviderReady(provider)).toBe(true)
  })

  it("should return false for provider without extractable address", () => {
    const provider = { someOtherProp: "value" }
    expect(isProviderReady(provider)).toBe(false)
  })

  it("should return true for provider with account.address", () => {
    const provider = {
      account: { address: mockAddress },
    }
    expect(isProviderReady(provider)).toBe(true)
  })

  it("should return true for provider with selectedAddress", () => {
    const provider = { selectedAddress: mockAddress }
    expect(isProviderReady(provider)).toBe(true)
  })
})
