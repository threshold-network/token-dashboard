import { renderHook } from "@testing-library/react-hooks"
import { waitFor } from "@testing-library/react"
import { useStarknetTBTCBalance } from "../useStarknetTBTCBalance"
import { useThreshold } from "../../../contexts/ThresholdContext"
import { useNonEVMConnection } from "../../useNonEVMConnection"
import { ChainName } from "../../../threshold-ts/types"

// Mock dependencies
jest.mock("../../../contexts/ThresholdContext")
jest.mock("../../useNonEVMConnection")

const mockUseThreshold = useThreshold as jest.MockedFunction<
  typeof useThreshold
>
const mockUseNonEVMConnection = useNonEVMConnection as jest.MockedFunction<
  typeof useNonEVMConnection
>

describe("useStarknetTBTCBalance", () => {
  const mockBalanceOf = jest.fn()
  const mockThreshold = {
    tbtc: {
      l2TbtcToken: {
        balanceOf: mockBalanceOf,
      },
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseThreshold.mockReturnValue(mockThreshold as any)
  })

  it("should return 0 balance when not connected to Starknet", async () => {
    mockUseNonEVMConnection.mockReturnValue({
      nonEVMChainName: null,
      nonEVMPublicKey: null,
      nonEVMProvider: null,
      isNonEVMActive: false,
      connectedWalletName: null,
      connectedWalletIcon: null,
      isNonEVMConnecting: false,
      isNonEVMDisconnecting: false,
      disconnectNonEVMWallet: jest.fn(),
    })

    const { result } = renderHook(() => useStarknetTBTCBalance())

    expect(result.current.balance).toBe("0")
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(mockBalanceOf).not.toHaveBeenCalled()
  })

  it("should fetch balance when connected to Starknet", async () => {
    const mockAddress =
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    const mockBalance = "1000000000000000000" // 1 tBTC

    mockUseNonEVMConnection.mockReturnValue({
      nonEVMChainName: ChainName.Starknet,
      nonEVMPublicKey: mockAddress,
      nonEVMProvider: {},
      isNonEVMActive: true,
      connectedWalletName: "Argent X",
      connectedWalletIcon: "/argent-icon.svg",
      isNonEVMConnecting: false,
      isNonEVMDisconnecting: false,
      disconnectNonEVMWallet: jest.fn(),
    })

    mockBalanceOf.mockResolvedValue({ toString: () => mockBalance })

    const { result } = renderHook(() => useStarknetTBTCBalance())

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.balance).toBe("1.0") // Formatted balance
    expect(result.current.error).toBeNull()
    expect(mockBalanceOf).toHaveBeenCalledWith(mockAddress)
  })

  it("should handle balance fetch errors gracefully", async () => {
    const mockAddress =
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    const mockError = new Error("Failed to fetch balance")

    mockUseNonEVMConnection.mockReturnValue({
      nonEVMChainName: ChainName.Starknet,
      nonEVMPublicKey: mockAddress,
      nonEVMProvider: {},
      isNonEVMActive: true,
      connectedWalletName: "Argent X",
      connectedWalletIcon: "/argent-icon.svg",
      isNonEVMConnecting: false,
      isNonEVMDisconnecting: false,
      disconnectNonEVMWallet: jest.fn(),
    })

    mockBalanceOf.mockRejectedValue(mockError)

    const { result } = renderHook(() => useStarknetTBTCBalance())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.balance).toBe("0")
    expect(result.current.error).toBe(mockError.message)
    expect(mockBalanceOf).toHaveBeenCalledWith(mockAddress)
  })

  it("should refetch balance when address changes", async () => {
    const mockAddress1 =
      "0x1111111111111111111111111111111111111111111111111111111111111111"
    const mockAddress2 =
      "0x2222222222222222222222222222222222222222222222222222222222222222"
    const mockBalance1 = "1000000000000000000" // 1 tBTC
    const mockBalance2 = "2000000000000000000" // 2 tBTC

    const mockConnection = {
      nonEVMChainName: ChainName.Starknet,
      nonEVMPublicKey: mockAddress1,
      nonEVMProvider: {},
      isNonEVMActive: true,
      connectedWalletName: "Argent X",
      connectedWalletIcon: "/argent-icon.svg",
      isNonEVMConnecting: false,
      isNonEVMDisconnecting: false,
      disconnectNonEVMWallet: jest.fn(),
    }

    mockUseNonEVMConnection.mockReturnValue(mockConnection)
    mockBalanceOf.mockResolvedValue({ toString: () => mockBalance1 })

    const { result, rerender } = renderHook(() => useStarknetTBTCBalance())

    await waitFor(() => {
      expect(result.current.balance).toBe("1.0")
    })

    // Change address
    mockUseNonEVMConnection.mockReturnValue({
      ...mockConnection,
      nonEVMPublicKey: mockAddress2,
    })
    mockBalanceOf.mockResolvedValue({ toString: () => mockBalance2 })

    rerender()

    await waitFor(() => {
      expect(result.current.balance).toBe("2.0")
    })

    expect(mockBalanceOf).toHaveBeenCalledWith(mockAddress1)
    expect(mockBalanceOf).toHaveBeenCalledWith(mockAddress2)
  })

  it("should handle l2TbtcToken not being available", async () => {
    const mockAddress =
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"

    mockUseThreshold.mockReturnValue({
      tbtc: {} as any, // No l2TbtcToken
    } as any)

    mockUseNonEVMConnection.mockReturnValue({
      nonEVMChainName: ChainName.Starknet,
      nonEVMPublicKey: mockAddress,
      nonEVMProvider: {},
      isNonEVMActive: true,
      connectedWalletName: "Argent X",
      connectedWalletIcon: "/argent-icon.svg",
      isNonEVMConnecting: false,
      isNonEVMDisconnecting: false,
      disconnectNonEVMWallet: jest.fn(),
    })

    const { result } = renderHook(() => useStarknetTBTCBalance())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.balance).toBe("0")
    expect(result.current.error).toBe("tBTC token not initialized")
  })

  it("should format various balance amounts correctly", async () => {
    const mockAddress =
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    const testCases = [
      { raw: "0", formatted: "0" },
      { raw: "1000000000000000", formatted: "0.001" },
      { raw: "123456789012345678", formatted: "0.123456789012345678" },
      { raw: "1234567890123456789012", formatted: "1234.567890123456789012" },
    ]

    mockUseNonEVMConnection.mockReturnValue({
      nonEVMChainName: ChainName.Starknet,
      nonEVMPublicKey: mockAddress,
      nonEVMProvider: {},
      isNonEVMActive: true,
      connectedWalletName: "Argent X",
      connectedWalletIcon: "/argent-icon.svg",
      isNonEVMConnecting: false,
      isNonEVMDisconnecting: false,
      disconnectNonEVMWallet: jest.fn(),
    })

    for (const { raw, formatted } of testCases) {
      mockBalanceOf.mockResolvedValue({ toString: () => raw })

      const { result } = renderHook(() => useStarknetTBTCBalance())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.balance).toBe(formatted)
    }
  })
})
