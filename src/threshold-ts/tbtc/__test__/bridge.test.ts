import { BigNumber, providers } from "ethers"
import { MaxUint256 } from "@ethersproject/constants"
import {
  Bridge,
  IBridge,
  BridgeOptions,
  BridgeQuote,
  BridgeRoute,
} from "../bridge"
import { EthereumConfig, CrossChainConfig } from "../../types"
import { IMulticall } from "../../multicall"

// Mock the utils module
jest.mock("../../utils", () => ({
  getArtifact: jest.fn(() => null),
  getContract: jest.fn(() => null),
}))

describe("Bridge", () => {
  let mockEthereumConfig: EthereumConfig
  let mockCrossChainConfig: CrossChainConfig
  let mockMulticall: IMulticall

  beforeEach(() => {
    // Create a mock signer that satisfies ethers Contract requirements
    const mockSigner = {
      provider: {
        _isProvider: true,
        getNetwork: jest
          .fn()
          .mockResolvedValue({ chainId: 60808, name: "bob" }),
      },
      _isSigner: true,
      getAddress: jest
        .fn()
        .mockResolvedValue("0x1234567890123456789012345678901234567890"),
      connectUnchecked: jest.fn().mockReturnThis(),
    }

    // Create a mock provider with required methods
    const mockProvider = {
      _isProvider: true,
      getSigner: jest.fn().mockReturnValue(mockSigner),
      getNetwork: jest.fn().mockResolvedValue({ chainId: 60808, name: "bob" }),
    } as unknown as providers.Provider

    mockEthereumConfig = {
      chainId: 60808, // BOB mainnet
      ethereumProviderOrSigner: mockProvider,
      account: "0x1234567890123456789012345678901234567890",
      shouldUseTestnetDevelopmentContracts: false,
    }

    mockCrossChainConfig = {
      isCrossChain: true,
      chainName: "BOB",
      nonEVMProvider: null,
    }

    mockMulticall = {
      aggregate: jest.fn(),
      getCurrentBlockTimestamp: jest.fn(),
      getEthBalance: jest.fn(),
    } as unknown as IMulticall
  })

  describe("instantiation", () => {
    it("should instantiate with required dependencies", () => {
      // Act
      const bridge = new Bridge(
        mockEthereumConfig,
        mockCrossChainConfig,
        mockMulticall
      )

      // Assert
      expect(bridge).toBeInstanceOf(Bridge)
    })

    it("should implement IBridge interface", () => {
      // Act
      const bridge = new Bridge(
        mockEthereumConfig,
        mockCrossChainConfig,
        mockMulticall
      )

      // Assert - Check that all interface methods exist
      expect(typeof bridge.withdraw).toBe("function")
      expect(typeof bridge.withdrawLegacy).toBe("function")
      expect(typeof bridge.depositToBob).toBe("function")
      expect(typeof bridge.withdrawToL1).toBe("function")
      expect(typeof bridge.approveForCcip).toBe("function")
      expect(typeof bridge.approveForStandardBridge).toBe("function")
      expect(typeof bridge.pickPath).toBe("function")
      expect(typeof bridge.quoteFees).toBe("function")
      expect(typeof bridge.getLegacyCapRemaining).toBe("function")
    })
  })

  describe("placeholder methods", () => {
    let bridge: Bridge
    let bridgeNonBob: Bridge

    beforeEach(() => {
      bridge = new Bridge(
        mockEthereumConfig,
        mockCrossChainConfig,
        mockMulticall
      )

      // Create a non-BOB bridge for testing uninitialized contracts
      const nonBobConfig = {
        ...mockEthereumConfig,
        chainId: 1, // Ethereum mainnet, not BOB
      }
      bridgeNonBob = new Bridge(
        nonBobConfig,
        mockCrossChainConfig,
        mockMulticall
      )
    })

    it("should throw error for withdraw without proper setup", async () => {
      // Since contracts are not properly initialized in this test setup,
      // withdraw should throw an error about contracts or token
      await expect(bridge.withdraw(BigNumber.from(100))).rejects.toThrow()
    })

    it("should throw error when contracts not initialized for withdrawLegacy", async () => {
      await expect(
        bridgeNonBob.withdrawLegacy(BigNumber.from(100))
      ).rejects.toThrow(
        "Bridge contracts not initialized. Ensure you're on BOB network."
      )
    })

    it("should throw 'not implemented' for depositToBob", async () => {
      await expect(bridge.depositToBob(BigNumber.from(100))).rejects.toThrow(
        "Method not implemented"
      )
    })

    it("should throw error for withdrawToL1 without proper setup", async () => {
      // Since contracts are not properly initialized in this test setup,
      // withdrawToL1 should throw an error
      await expect(bridge.withdrawToL1(BigNumber.from(100))).rejects.toThrow()
    })

    // approveForStandardBridge is now implemented, so removing this test

    it("should throw error when calling pickPath without proper mocks", async () => {
      // This test verifies the placeholder behavior when contracts are not properly mocked
      await expect(bridge.pickPath(BigNumber.from(100))).rejects.toThrow()
    })

    it("should throw error for quoteFees when contracts not initialized", async () => {
      // Since placeholder test Bridge has no mocked contracts, it should fail on initialization check
      await expect(bridge.quoteFees(BigNumber.from(100))).rejects.toThrow()
    })

    it("should throw error when contracts not initialized", async () => {
      // This test verifies the placeholder behavior when contracts are null
      // The Bridge instance in this suite has mock contracts that will fail
      await expect(bridge.getLegacyCapRemaining()).rejects.toThrow()
    })
  })

  describe("getLegacyCapRemaining", () => {
    let bridge: Bridge
    let mockTokenContract: any

    beforeEach(() => {
      // Create mock token contract
      mockTokenContract = {
        legacyCapRemaining: jest.fn(),
        address: "0xMockTokenAddress",
      }

      // Mock getArtifact and getContract to return our mock contract
      jest.mock("../../utils", () => ({
        ...jest.requireActual("../../utils"),
        getArtifact: jest.fn((name) => {
          if (name === "OptimismMintableUpgradableTBTC") {
            return {
              address: "0xMockTokenAddress",
              abi: [],
            }
          }
          return null
        }),
        getContract: jest.fn((address, abi, provider, account) => {
          if (address === "0xMockTokenAddress") {
            return mockTokenContract
          }
          return null
        }),
      }))

      bridge = new Bridge(
        mockEthereumConfig,
        mockCrossChainConfig,
        mockMulticall
      )

      // Manually set the token contract for testing
      ;(bridge as any)._tokenContract = mockTokenContract
    })

    afterEach(() => {
      jest.clearAllMocks()
      jest.restoreAllMocks()
      jest.useRealTimers()
    })

    it("should fetch legacyCapRemaining from contract", async () => {
      // Arrange
      const expectedCap = BigNumber.from("1000000000000000000") // 1 tBTC
      mockTokenContract.legacyCapRemaining.mockResolvedValue(expectedCap)

      // Act
      const result = await bridge.getLegacyCapRemaining()

      // Assert
      expect(result).toEqual(expectedCap)
      expect(mockTokenContract.legacyCapRemaining).toHaveBeenCalledTimes(1)
    })

    it("should use cached value within TTL", async () => {
      // Arrange
      const expectedCap = BigNumber.from("1000000000000000000")
      mockTokenContract.legacyCapRemaining.mockResolvedValue(expectedCap)

      // Act - First call
      const result1 = await bridge.getLegacyCapRemaining()

      // Act - Second call (should use cache)
      const result2 = await bridge.getLegacyCapRemaining()

      // Assert
      expect(result1).toEqual(expectedCap)
      expect(result2).toEqual(expectedCap)
      expect(mockTokenContract.legacyCapRemaining).toHaveBeenCalledTimes(1) // Called only once
    })

    it("should refresh cache after TTL expires", async () => {
      // Arrange - Mock Date.now
      const mockNow = Date.now()
      const dateNowSpy = jest.spyOn(Date, "now")

      // First call
      dateNowSpy.mockReturnValue(mockNow)

      const cap1 = BigNumber.from("1000000000000000000")
      const cap2 = BigNumber.from("2000000000000000000")
      mockTokenContract.legacyCapRemaining
        .mockResolvedValueOnce(cap1)
        .mockResolvedValueOnce(cap2)

      // Act - First call
      const result1 = await bridge.getLegacyCapRemaining()

      // Verify first result
      expect(result1).toEqual(cap1)

      // Mock time to be past TTL for second call
      dateNowSpy.mockReturnValue(mockNow + 61000)

      // Act - Second call (should fetch fresh data due to mocked time)
      const result2 = await bridge.getLegacyCapRemaining()

      // Assert
      expect(result2).toEqual(cap2)
      expect(mockTokenContract.legacyCapRemaining).toHaveBeenCalledTimes(2)

      dateNowSpy.mockRestore()
    })

    it("should throw error when token contract not initialized", async () => {
      // Arrange - Remove token contract
      ;(bridge as any)._tokenContract = null

      // Act & Assert
      await expect(bridge.getLegacyCapRemaining()).rejects.toThrow(
        "Token contract not initialized"
      )
    })

    it("should return stale cache on contract call failure if available", async () => {
      // Arrange
      const mockNow = Date.now()
      const dateNowSpy = jest.spyOn(Date, "now")

      // First call - current time
      dateNowSpy.mockReturnValue(mockNow)

      const cachedValue = BigNumber.from("1000000000000000000")

      // Spy on console methods before the calls
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation()
      const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation()

      mockTokenContract.legacyCapRemaining
        .mockResolvedValueOnce(cachedValue)
        .mockRejectedValueOnce(new Error("RPC error"))

      // First call to populate cache
      await bridge.getLegacyCapRemaining()

      // Move time forward past TTL
      dateNowSpy.mockReturnValue(mockNow + 61000)

      // Act - Should return stale cache
      const result = await bridge.getLegacyCapRemaining()

      // Assert
      expect(result).toEqual(cachedValue)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to fetch legacyCapRemaining:",
        expect.any(Error)
      )
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Returning stale cache data due to contract call failure"
      )

      // Cleanup
      consoleErrorSpy.mockRestore()
      consoleWarnSpy.mockRestore()
      dateNowSpy.mockRestore()
    })

    it("should throw error on contract call failure with no cache", async () => {
      // Arrange
      mockTokenContract.legacyCapRemaining.mockRejectedValue(
        new Error("RPC error")
      )

      // Act & Assert
      await expect(bridge.getLegacyCapRemaining()).rejects.toThrow(
        "Failed to get legacy cap remaining: RPC error"
      )
    })

    it("should handle zero legacyCapRemaining", async () => {
      // Arrange
      mockTokenContract.legacyCapRemaining.mockResolvedValue(BigNumber.from(0))

      // Act
      const result = await bridge.getLegacyCapRemaining()

      // Assert
      expect(result).toEqual(BigNumber.from(0))
    })

    it("should handle very large legacyCapRemaining values", async () => {
      // Arrange
      const largeCap = BigNumber.from("1000000000000000000000000") // 1 million tBTC
      mockTokenContract.legacyCapRemaining.mockResolvedValue(largeCap)

      // Act
      const result = await bridge.getLegacyCapRemaining()

      // Assert
      expect(result).toEqual(largeCap)
    })
  })

  describe("contract initialization", () => {
    it("should initialize contracts for BOB mainnet", () => {
      // Arrange
      const bobMainnetConfig = {
        ...mockEthereumConfig,
        chainId: 60808,
      }

      // Act
      const bridge = new Bridge(
        bobMainnetConfig,
        mockCrossChainConfig,
        mockMulticall
      )

      // Assert
      expect(bridge).toBeInstanceOf(Bridge)
      // Contract initialization happens in constructor
      // We'll test actual contract loading in integration tests
    })

    it("should initialize contracts for BOB testnet", () => {
      // Arrange
      const bobTestnetConfig = {
        ...mockEthereumConfig,
        chainId: 808813,
      }

      // Act
      const bridge = new Bridge(
        bobTestnetConfig,
        mockCrossChainConfig,
        mockMulticall
      )

      // Assert
      expect(bridge).toBeInstanceOf(Bridge)
    })

    it("should handle non-BOB networks gracefully", () => {
      // Arrange
      const nonBobConfig = {
        ...mockEthereumConfig,
        chainId: 1, // Ethereum mainnet
      }

      // Act
      const bridge = new Bridge(
        nonBobConfig,
        mockCrossChainConfig,
        mockMulticall
      )

      // Assert
      expect(bridge).toBeInstanceOf(Bridge)
      // Contracts should remain null for non-BOB networks
    })

    it("should ensure contracts are initialized before operations", async () => {
      // Arrange
      const nonBobConfig = {
        ...mockEthereumConfig,
        chainId: 1, // Non-BOB network
      }
      const bridge = new Bridge(
        nonBobConfig,
        mockCrossChainConfig,
        mockMulticall
      )

      // Act & Assert
      await expect(bridge.getLegacyCapRemaining()).rejects.toThrow(
        "Token contract not initialized"
      )
    })
  })

  describe("pickPath", () => {
    let bridge: Bridge
    let mockTokenContract: any

    beforeEach(() => {
      mockTokenContract = {
        legacyCapRemaining: jest.fn(),
        address: "0xMockTokenAddress",
      }

      bridge = new Bridge(
        mockEthereumConfig,
        mockCrossChainConfig,
        mockMulticall
      )

      // Manually set the token contract for testing
      ;(bridge as any)._tokenContract = mockTokenContract
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("should return 'standard' when amount fits in legacy cap", async () => {
      // Arrange
      const amount = BigNumber.from("500000000000000000") // 0.5 tBTC
      const legacyCap = BigNumber.from("1000000000000000000") // 1 tBTC
      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)

      // Act
      const path = await bridge.pickPath(amount)

      // Assert
      expect(path).toBe("standard")
    })

    it("should return 'ccip' when legacy cap is zero", async () => {
      // Arrange
      const amount = BigNumber.from("1000000000000000000") // 1 tBTC
      const legacyCap = BigNumber.from("0")
      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)

      // Act
      const path = await bridge.pickPath(amount)

      // Assert
      expect(path).toBe("ccip")
    })

    it("should throw error when amount exceeds legacy cap but cap > 0", async () => {
      // Arrange
      const amount = BigNumber.from("1500000000000000000") // 1.5 tBTC
      const legacyCap = BigNumber.from("1000000000000000000") // 1 tBTC
      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)

      // Act & Assert
      await expect(bridge.pickPath(amount)).rejects.toThrow(
        "Amount 1500000000000000000 exceeds legacy cap remaining 1000000000000000000. " +
          "Please wait for legacy cap to deplete or reduce your withdrawal amount."
      )
    })

    it("should throw error for zero amount", async () => {
      // Arrange
      const amount = BigNumber.from("0")

      // Act & Assert
      await expect(bridge.pickPath(amount)).rejects.toThrow(
        "Amount must be greater than zero"
      )
    })

    it("should throw error for negative amount", async () => {
      // Arrange
      const amount = BigNumber.from("-1000000000000000000")

      // Act & Assert
      await expect(bridge.pickPath(amount)).rejects.toThrow(
        "Amount must be greater than zero"
      )
    })

    it("should return 'standard' when amount exactly equals legacy cap", async () => {
      // Arrange
      const amount = BigNumber.from("1000000000000000000") // 1 tBTC
      const legacyCap = BigNumber.from("1000000000000000000") // 1 tBTC
      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)

      // Act
      const path = await bridge.pickPath(amount)

      // Assert
      expect(path).toBe("standard")
    })

    it("should handle very large amounts correctly", async () => {
      // Arrange
      const amount = BigNumber.from("1000000000000000000000000") // 1 million tBTC
      const legacyCap = BigNumber.from("1000000000000000000") // 1 tBTC
      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)

      // Act & Assert
      await expect(bridge.pickPath(amount)).rejects.toThrow(
        /exceeds legacy cap remaining/
      )
    })

    it("should use cached legacyCapRemaining value when available", async () => {
      // Arrange
      const amount = BigNumber.from("500000000000000000") // 0.5 tBTC
      const legacyCap = BigNumber.from("1000000000000000000") // 1 tBTC
      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)

      // First call to populate cache
      await bridge.getLegacyCapRemaining()

      // Act
      const path = await bridge.pickPath(amount)

      // Assert
      expect(path).toBe("standard")
      // Should only be called once due to caching
      expect(mockTokenContract.legacyCapRemaining).toHaveBeenCalledTimes(1)
    })
  })

  describe("canWithdraw", () => {
    let bridge: Bridge
    let mockTokenContract: any

    beforeEach(() => {
      mockTokenContract = {
        legacyCapRemaining: jest.fn(),
        address: "0xMockTokenAddress",
      }

      bridge = new Bridge(
        mockEthereumConfig,
        mockCrossChainConfig,
        mockMulticall
      )

      // Manually set the token contract for testing
      ;(bridge as any)._tokenContract = mockTokenContract
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("should return canWithdraw true with route when amount is valid", async () => {
      // Arrange
      const amount = BigNumber.from("500000000000000000") // 0.5 tBTC
      const legacyCap = BigNumber.from("1000000000000000000") // 1 tBTC
      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)

      // Act
      const result = await bridge.canWithdraw(amount)

      // Assert
      expect(result).toEqual({
        canWithdraw: true,
        route: "standard",
      })
    })

    it("should return canWithdraw false with reason when amount exceeds cap", async () => {
      // Arrange
      const amount = BigNumber.from("1500000000000000000") // 1.5 tBTC
      const legacyCap = BigNumber.from("1000000000000000000") // 1 tBTC
      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)

      // Act
      const result = await bridge.canWithdraw(amount)

      // Assert
      expect(result.canWithdraw).toBe(false)
      expect(result.route).toBeUndefined()
      expect(result.reason).toContain("exceeds legacy cap remaining")
    })

    it("should return canWithdraw false for zero amount", async () => {
      // Arrange
      const amount = BigNumber.from("0")

      // Act
      const result = await bridge.canWithdraw(amount)

      // Assert
      expect(result).toEqual({
        canWithdraw: false,
        reason: "Amount must be greater than zero",
      })
    })
  })

  describe("approveForCcip", () => {
    let bridge: Bridge
    let mockTokenContract: any
    let mockCcipContract: any

    beforeEach(() => {
      mockTokenContract = {
        allowance: jest.fn(),
        approve: jest.fn(),
        address: "0xMockTokenAddress",
        interface: {
          encodeFunctionData: jest.fn(),
        },
      }

      mockCcipContract = {
        address: "0xMockCcipAddress",
      }

      bridge = new Bridge(
        mockEthereumConfig,
        mockCrossChainConfig,
        mockMulticall
      )

      // Manually set the contracts for testing
      ;(bridge as any)._tokenContract = mockTokenContract
      ;(bridge as any)._ccipContract = mockCcipContract
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("should skip approval when allowance is sufficient", async () => {
      // Arrange
      const amount = BigNumber.from("500000000000000000") // 0.5 tBTC
      const currentAllowance = BigNumber.from("1000000000000000000") // 1 tBTC
      mockTokenContract.allowance.mockResolvedValue(currentAllowance)

      // Act
      const result = await bridge.approveForCcip(amount)

      // Assert
      expect(result).toBeNull()
      expect(mockTokenContract.approve).not.toHaveBeenCalled()
      expect(mockTokenContract.allowance).toHaveBeenCalledWith(
        mockEthereumConfig.account,
        mockCcipContract.address
      )
    })

    it("should send approval transaction when allowance is insufficient", async () => {
      // Arrange
      const amount = BigNumber.from("1000000000000000000") // 1 tBTC
      const currentAllowance = BigNumber.from("0")
      const mockTx = { hash: "0x123", wait: jest.fn() }

      mockTokenContract.allowance.mockResolvedValue(currentAllowance)
      mockTokenContract.approve.mockResolvedValue(mockTx)

      // Act
      const result = await bridge.approveForCcip(amount)

      // Assert
      expect(result).toBe(mockTx)
      expect(mockTokenContract.approve).toHaveBeenCalledWith(
        mockCcipContract.address,
        BigNumber.from(
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        ) // MaxUint256
      )
    })

    it("should throw error when contracts not initialized", async () => {
      // Arrange
      const nonBobConfig = {
        ...mockEthereumConfig,
        chainId: 1, // Ethereum mainnet, not BOB
      }
      const bridgeNoContracts = new Bridge(
        nonBobConfig,
        mockCrossChainConfig,
        mockMulticall
      )
      const amount = BigNumber.from("1000000000000000000")

      // Act & Assert
      await expect(bridgeNoContracts.approveForCcip(amount)).rejects.toThrow(
        "Contracts not initialized"
      )
    })

    it("should throw error when no account connected", async () => {
      // Arrange
      const configNoAccount = { ...mockEthereumConfig, account: undefined }
      const bridgeNoAccount = new Bridge(
        configNoAccount,
        mockCrossChainConfig,
        mockMulticall
      )
      ;(bridgeNoAccount as any)._tokenContract = mockTokenContract
      ;(bridgeNoAccount as any)._ccipContract = mockCcipContract

      const amount = BigNumber.from("1000000000000000000")

      // Act & Assert
      await expect(bridgeNoAccount.approveForCcip(amount)).rejects.toThrow(
        "No account connected"
      )
    })

    it("should handle approval transaction errors", async () => {
      // Arrange
      const amount = BigNumber.from("1000000000000000000")
      const currentAllowance = BigNumber.from("0")

      mockTokenContract.allowance.mockResolvedValue(currentAllowance)
      mockTokenContract.approve.mockRejectedValue(new Error("User rejected"))

      // Act & Assert
      await expect(bridge.approveForCcip(amount)).rejects.toThrow(
        "CCIP approval failed: User rejected"
      )
    })

    it("should approve exactly at the boundary", async () => {
      // Arrange
      const amount = BigNumber.from("1000000000000000000") // 1 tBTC
      const currentAllowance = BigNumber.from("999999999999999999") // Slightly less
      const mockTx = { hash: "0x123", wait: jest.fn() }

      mockTokenContract.allowance.mockResolvedValue(currentAllowance)
      mockTokenContract.approve.mockResolvedValue(mockTx)

      // Act
      const result = await bridge.approveForCcip(amount)

      // Assert
      expect(result).toBe(mockTx)
      expect(mockTokenContract.approve).toHaveBeenCalled()
    })
  })

  describe("getCcipAllowance", () => {
    let bridge: Bridge
    let mockTokenContract: any
    let mockCcipContract: any

    beforeEach(() => {
      mockTokenContract = {
        allowance: jest.fn(),
        address: "0xMockTokenAddress",
      }

      mockCcipContract = {
        address: "0xMockCcipAddress",
      }

      bridge = new Bridge(
        mockEthereumConfig,
        mockCrossChainConfig,
        mockMulticall
      )

      // Manually set the contracts for testing
      ;(bridge as any)._tokenContract = mockTokenContract
      ;(bridge as any)._ccipContract = mockCcipContract
    })

    it("should return current CCIP allowance", async () => {
      // Arrange
      const expectedAllowance = BigNumber.from("1000000000000000000")
      mockTokenContract.allowance.mockResolvedValue(expectedAllowance)

      // Act
      const result = await bridge.getCcipAllowance()

      // Assert
      expect(result).toEqual(expectedAllowance)
      expect(mockTokenContract.allowance).toHaveBeenCalledWith(
        mockEthereumConfig.account,
        mockCcipContract.address
      )
    })

    it("should throw error when contracts not initialized", async () => {
      // Arrange
      const nonBobConfig = {
        ...mockEthereumConfig,
        chainId: 1, // Ethereum mainnet, not BOB
      }
      const bridgeNoContracts = new Bridge(
        nonBobConfig,
        mockCrossChainConfig,
        mockMulticall
      )

      // Act & Assert
      await expect(bridgeNoContracts.getCcipAllowance()).rejects.toThrow(
        "Contracts not initialized"
      )
    })
  })

  describe("getAllowances", () => {
    let bridge: Bridge
    let mockTokenContract: any
    let mockCcipContract: any
    let mockStandardBridgeContract: any

    beforeEach(() => {
      mockTokenContract = {
        allowance: jest.fn(),
        address: "0xMockTokenAddress",
        interface: {
          encodeFunctionData: jest.fn(),
        },
      }

      mockCcipContract = {
        address: "0xMockCcipAddress",
      }

      mockStandardBridgeContract = {
        address: "0xMockStandardBridgeAddress",
      }

      bridge = new Bridge(
        mockEthereumConfig,
        mockCrossChainConfig,
        mockMulticall
      )

      // Manually set the contracts for testing
      ;(bridge as any)._tokenContract = mockTokenContract
      ;(bridge as any)._ccipContract = mockCcipContract
      ;(bridge as any)._standardBridgeContract = mockStandardBridgeContract
    })

    it("should return allowances for both bridges", async () => {
      // Arrange
      const ccipAllowance = BigNumber.from("1000000000000000000")
      const standardAllowance = BigNumber.from("2000000000000000000")

      mockMulticall.aggregate.mockResolvedValue([
        ccipAllowance,
        standardAllowance,
      ])

      // Act
      const result = await bridge.getAllowances()

      // Assert
      expect(result).toEqual({
        ccip: ccipAllowance,
        standardBridge: standardAllowance,
      })
      expect(mockMulticall.aggregate).toHaveBeenCalledWith([
        {
          interface: mockTokenContract.interface,
          address: mockTokenContract.address,
          method: "allowance",
          args: [mockEthereumConfig.account, mockCcipContract.address],
        },
        {
          interface: mockTokenContract.interface,
          address: mockTokenContract.address,
          method: "allowance",
          args: [
            mockEthereumConfig.account,
            mockStandardBridgeContract.address,
          ],
        },
      ])
    })

    it("should throw error when contracts not initialized", async () => {
      // Arrange
      const nonBobConfig = {
        ...mockEthereumConfig,
        chainId: 1, // Ethereum mainnet, not BOB
      }
      const bridgeNoContracts = new Bridge(
        nonBobConfig,
        mockCrossChainConfig,
        mockMulticall
      )

      // Act & Assert
      await expect(bridgeNoContracts.getAllowances()).rejects.toThrow(
        "Contracts not initialized"
      )
    })
  })

  describe("approveForStandardBridge", () => {
    let bridge: Bridge
    let mockTokenContract: any
    let mockStandardBridgeContract: any

    beforeEach(() => {
      mockTokenContract = {
        allowance: jest.fn(),
        approve: jest.fn(),
        address: "0xMockTokenAddress",
        interface: {
          encodeFunctionData: jest.fn(),
        },
      }

      mockStandardBridgeContract = {
        address: "0xMockStandardBridgeAddress",
      }

      bridge = new Bridge(
        mockEthereumConfig,
        mockCrossChainConfig,
        mockMulticall
      )

      // Manually set the contracts for testing
      ;(bridge as any)._tokenContract = mockTokenContract
      ;(bridge as any)._standardBridgeContract = mockStandardBridgeContract
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("should skip approval when allowance is sufficient", async () => {
      // Arrange
      const amount = BigNumber.from("500000000000000000") // 0.5 tBTC
      const currentAllowance = BigNumber.from("1000000000000000000") // 1 tBTC
      mockTokenContract.allowance.mockResolvedValue(currentAllowance)

      // Act
      const result = await bridge.approveForStandardBridge(amount)

      // Assert
      expect(result).toBeNull()
      expect(mockTokenContract.approve).not.toHaveBeenCalled()
      expect(mockTokenContract.allowance).toHaveBeenCalledWith(
        mockEthereumConfig.account,
        mockStandardBridgeContract.address
      )
    })

    it("should send approval transaction when allowance is insufficient", async () => {
      // Arrange
      const amount = BigNumber.from("1000000000000000000") // 1 tBTC
      const currentAllowance = BigNumber.from("0")
      const mockTx = { hash: "0x456", wait: jest.fn() }

      mockTokenContract.allowance.mockResolvedValue(currentAllowance)
      mockTokenContract.approve.mockResolvedValue(mockTx)

      // Act
      const result = await bridge.approveForStandardBridge(amount)

      // Assert
      expect(result).toBe(mockTx)
      expect(mockTokenContract.approve).toHaveBeenCalledWith(
        mockStandardBridgeContract.address,
        BigNumber.from(
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        ) // MaxUint256
      )
    })

    it("should throw error when contracts not initialized", async () => {
      // Arrange
      const nonBobConfig = {
        ...mockEthereumConfig,
        chainId: 1, // Ethereum mainnet, not BOB
      }
      const bridgeNoContracts = new Bridge(
        nonBobConfig,
        mockCrossChainConfig,
        mockMulticall
      )
      const amount = BigNumber.from("1000000000000000000")

      // Act & Assert
      await expect(
        bridgeNoContracts.approveForStandardBridge(amount)
      ).rejects.toThrow("Contracts not initialized")
    })

    it("should throw error when no account connected", async () => {
      // Arrange
      const configNoAccount = { ...mockEthereumConfig, account: undefined }
      const bridgeNoAccount = new Bridge(
        configNoAccount,
        mockCrossChainConfig,
        mockMulticall
      )
      ;(bridgeNoAccount as any)._tokenContract = mockTokenContract
      ;(bridgeNoAccount as any)._standardBridgeContract =
        mockStandardBridgeContract

      const amount = BigNumber.from("1000000000000000000")

      // Act & Assert
      await expect(
        bridgeNoAccount.approveForStandardBridge(amount)
      ).rejects.toThrow("No account connected")
    })

    it("should handle approval transaction errors", async () => {
      // Arrange
      const amount = BigNumber.from("1000000000000000000")
      const currentAllowance = BigNumber.from("0")

      mockTokenContract.allowance.mockResolvedValue(currentAllowance)
      mockTokenContract.approve.mockRejectedValue(new Error("User rejected"))

      // Act & Assert
      await expect(bridge.approveForStandardBridge(amount)).rejects.toThrow(
        "Standard Bridge approval failed: User rejected"
      )
    })

    it("should approve exactly at the boundary", async () => {
      // Arrange
      const amount = BigNumber.from("1000000000000000000") // 1 tBTC
      const currentAllowance = BigNumber.from("999999999999999999") // Slightly less
      const mockTx = { hash: "0x789", wait: jest.fn() }

      mockTokenContract.allowance.mockResolvedValue(currentAllowance)
      mockTokenContract.approve.mockResolvedValue(mockTx)

      // Act
      const result = await bridge.approveForStandardBridge(amount)

      // Assert
      expect(result).toBe(mockTx)
      expect(mockTokenContract.approve).toHaveBeenCalled()
    })

    it("should use the same pattern as approveForCcip", async () => {
      // This test ensures consistency between the two approval methods
      // Arrange
      const amount = BigNumber.from("1000000000000000000")
      const currentAllowance = BigNumber.from("500000000000000000")
      const mockTx = { hash: "0xabc", wait: jest.fn() }

      mockTokenContract.allowance.mockResolvedValue(currentAllowance)
      mockTokenContract.approve.mockResolvedValue(mockTx)

      // Act
      const result = await bridge.approveForStandardBridge(amount)

      // Assert
      expect(result).toBe(mockTx)
      // Should approve for MaxUint256, not just the amount
      expect(mockTokenContract.approve).toHaveBeenCalledWith(
        mockStandardBridgeContract.address,
        BigNumber.from(
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        )
      )
    })
  })

  describe("withdraw", () => {
    let bridge: Bridge
    let mockTokenContract: any
    let mockCcipContract: any

    beforeEach(() => {
      mockTokenContract = {
        allowance: jest.fn(),
        approve: jest.fn(),
        legacyCapRemaining: jest.fn(),
        address: "0xMockTokenAddress",
        interface: {
          encodeFunctionData: jest.fn(),
        },
      }

      mockCcipContract = {
        address: "0xMockCcipAddress",
        withdraw: jest.fn(),
      }

      bridge = new Bridge(
        mockEthereumConfig,
        mockCrossChainConfig,
        mockMulticall
      )

      // Manually set the contracts for testing
      ;(bridge as any)._tokenContract = mockTokenContract
      ;(bridge as any)._ccipContract = mockCcipContract
      ;(bridge as any)._standardBridgeContract = {
        address: "0xMockStandardBridgeAddress",
      }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("should execute CCIP withdrawal when legacy cap is zero", async () => {
      // Arrange
      const amount = BigNumber.from("1000000000000000000") // 1 tBTC
      const legacyCap = BigNumber.from("0")
      const mockTx = { hash: "0xccip123", wait: jest.fn() }
      const mockApprovalTx = { hash: "0xapproval123", wait: jest.fn() }

      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)
      mockTokenContract.allowance.mockResolvedValue(BigNumber.from("0"))
      mockTokenContract.approve.mockResolvedValue(mockApprovalTx)
      mockCcipContract.withdraw.mockResolvedValue(mockTx)

      // Act
      const result = await bridge.withdraw(amount)

      // Assert
      expect(result).toBe(mockTx)
      expect(mockCcipContract.withdraw).toHaveBeenCalledWith(
        mockEthereumConfig.account,
        amount,
        {}
      )
      expect(mockApprovalTx.wait).toHaveBeenCalled()
    })

    it("should use recipient from options if provided", async () => {
      // Arrange
      const amount = BigNumber.from("1000000000000000000")
      const recipient = "0x9876543210987654321098765432109876543210"
      const legacyCap = BigNumber.from("0")
      const mockTx = { hash: "0xccip456", wait: jest.fn() }

      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)
      mockTokenContract.allowance.mockResolvedValue(
        BigNumber.from("10000000000000000000")
      )
      mockCcipContract.withdraw.mockResolvedValue(mockTx)

      // Act
      const result = await bridge.withdraw(amount, { recipient })

      // Assert
      expect(result).toBe(mockTx)
      expect(mockCcipContract.withdraw).toHaveBeenCalledWith(
        recipient,
        amount,
        {}
      )
    })

    it("should throw error when amount fits within legacy cap", async () => {
      // Arrange
      const amount = BigNumber.from("500000000000000000") // 0.5 tBTC
      const legacyCap = BigNumber.from("1000000000000000000") // 1 tBTC
      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)

      // Act & Assert
      await expect(bridge.withdraw(amount)).rejects.toThrow(
        "Amount fits within legacy cap. Use withdrawLegacy() instead."
      )
    })

    it("should throw error for zero amount", async () => {
      // Arrange
      const amount = BigNumber.from("0")

      // Act & Assert
      await expect(bridge.withdraw(amount)).rejects.toThrow(
        "Withdrawal amount must be greater than zero"
      )
    })

    it("should throw error when contracts not initialized", async () => {
      // Arrange
      const nonBobConfig = {
        ...mockEthereumConfig,
        chainId: 1, // Ethereum mainnet, not BOB
      }
      const bridgeNoContracts = new Bridge(
        nonBobConfig,
        mockCrossChainConfig,
        mockMulticall
      )
      const amount = BigNumber.from("1000000000000000000")

      // Act & Assert
      await expect(bridgeNoContracts.withdraw(amount)).rejects.toThrow(
        "Bridge contracts not initialized. Ensure you're on BOB network."
      )
    })

    it("should throw error when no account connected", async () => {
      // Arrange
      const configNoAccount = { ...mockEthereumConfig, account: undefined }
      const bridgeNoAccount = new Bridge(
        configNoAccount,
        mockCrossChainConfig,
        mockMulticall
      )
      ;(bridgeNoAccount as any)._tokenContract = mockTokenContract
      ;(bridgeNoAccount as any)._ccipContract = mockCcipContract
      ;(bridgeNoAccount as any)._standardBridgeContract = {
        address: "0xMockStandardBridgeAddress",
      }

      const amount = BigNumber.from("1000000000000000000")
      mockTokenContract.legacyCapRemaining.mockResolvedValue(
        BigNumber.from("0")
      )

      // Act & Assert
      await expect(bridgeNoAccount.withdraw(amount)).rejects.toThrow(
        "No account connected"
      )
    })

    it("should pass gas options to transaction", async () => {
      // Arrange
      const amount = BigNumber.from("1000000000000000000")
      const gasLimit = BigNumber.from("500000")
      const maxFeePerGas = BigNumber.from("30000000000") // 30 gwei
      const maxPriorityFeePerGas = BigNumber.from("2000000000") // 2 gwei
      const legacyCap = BigNumber.from("0")
      const mockTx = { hash: "0xccip789", wait: jest.fn() }

      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)
      mockTokenContract.allowance.mockResolvedValue(
        BigNumber.from("10000000000000000000")
      )
      mockCcipContract.withdraw.mockResolvedValue(mockTx)

      // Act
      const result = await bridge.withdraw(amount, {
        gasLimit,
        maxFeePerGas,
        maxPriorityFeePerGas,
      })

      // Assert
      expect(result).toBe(mockTx)
      expect(mockCcipContract.withdraw).toHaveBeenCalledWith(
        mockEthereumConfig.account,
        amount,
        {
          gasLimit,
          maxFeePerGas,
          maxPriorityFeePerGas,
        }
      )
    })

    it("should skip approval when allowance is sufficient", async () => {
      // Arrange
      const amount = BigNumber.from("1000000000000000000")
      const legacyCap = BigNumber.from("0")
      const mockTx = { hash: "0xccipNoApproval", wait: jest.fn() }

      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)
      mockTokenContract.allowance.mockResolvedValue(
        BigNumber.from("2000000000000000000")
      ) // 2 tBTC allowance
      mockCcipContract.withdraw.mockResolvedValue(mockTx)

      // Act
      const result = await bridge.withdraw(amount)

      // Assert
      expect(result).toBe(mockTx)
      expect(mockTokenContract.approve).not.toHaveBeenCalled()
    })

    it("should handle CCIP contract call errors", async () => {
      // Arrange
      const amount = BigNumber.from("1000000000000000000")
      const legacyCap = BigNumber.from("0")

      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)
      mockTokenContract.allowance.mockResolvedValue(
        BigNumber.from("10000000000000000000")
      )
      mockCcipContract.withdraw.mockRejectedValue(
        new Error("Insufficient liquidity")
      )

      // Act & Assert
      await expect(bridge.withdraw(amount)).rejects.toThrow(
        "CCIP withdrawal failed: Insufficient liquidity"
      )
    })

    it("should handle blocked scenario (amount exceeds cap > 0)", async () => {
      // Arrange
      const amount = BigNumber.from("1500000000000000000") // 1.5 tBTC
      const legacyCap = BigNumber.from("1000000000000000000") // 1 tBTC
      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)

      // Act & Assert
      await expect(bridge.withdraw(amount)).rejects.toThrow(
        /exceeds legacy cap remaining/
      )
    })
  })

  describe("withdrawLegacy", () => {
    let bridge: Bridge
    let mockTokenContract: any
    let mockStandardBridgeContract: any

    beforeEach(() => {
      mockTokenContract = {
        allowance: jest.fn(),
        approve: jest.fn(),
        legacyCapRemaining: jest.fn(),
        address: "0xMockTokenAddress",
      }

      mockStandardBridgeContract = {
        address: "0xMockStandardBridgeAddress",
        withdrawTo: jest.fn(),
      }

      bridge = new Bridge(
        mockEthereumConfig,
        mockCrossChainConfig,
        mockMulticall
      )

      // Manually set the contracts for testing
      ;(bridge as any)._tokenContract = mockTokenContract
      ;(bridge as any)._ccipContract = {
        address: "0xMockCcipAddress",
      }
      ;(bridge as any)._standardBridgeContract = mockStandardBridgeContract
    })

    it("should execute standard bridge withdrawal when amount is within legacy cap", async () => {
      // Arrange
      const amount = BigNumber.from("500000000000000000") // 0.5 tBTC
      const legacyCap = BigNumber.from("1000000000000000000") // 1 tBTC
      const mockTx = { hash: "0xstd123", wait: jest.fn() }

      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)
      mockTokenContract.allowance.mockResolvedValue(
        BigNumber.from("10000000000000000000")
      )
      mockStandardBridgeContract.withdrawTo.mockResolvedValue(mockTx)

      // Act
      const result = await bridge.withdrawLegacy(amount)

      // Assert
      expect(result).toBe(mockTx)
      expect(mockStandardBridgeContract.withdrawTo).toHaveBeenCalledWith(
        mockTokenContract.address,
        mockEthereumConfig.account,
        amount,
        0, // default deadline
        "0x", // empty extra data
        {}
      )
    })

    it("should throw error when amount exceeds legacy cap", async () => {
      // Arrange
      const amount = BigNumber.from("1500000000000000000") // 1.5 tBTC
      const legacyCap = BigNumber.from("1000000000000000000") // 1 tBTC

      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)

      // Act & Assert
      await expect(bridge.withdrawLegacy(amount)).rejects.toThrow(
        /Amount 1500000000000000000 exceeds legacy cap remaining 1000000000000000000/
      )
    })

    it("should throw error when amount is zero or negative", async () => {
      // Arrange
      const zeroAmount = BigNumber.from("0")

      // Act & Assert
      await expect(bridge.withdrawLegacy(zeroAmount)).rejects.toThrow(
        "Withdrawal amount must be greater than zero"
      )
    })

    it("should throw error when contracts not initialized", async () => {
      // Arrange
      const nonBobConfig = {
        ...mockEthereumConfig,
        chainId: 1, // Ethereum mainnet, not BOB
      }
      const bridgeNoContracts = new Bridge(
        nonBobConfig,
        mockCrossChainConfig,
        mockMulticall
      )
      const amount = BigNumber.from("1000000000000000000")

      // Act & Assert
      await expect(bridgeNoContracts.withdrawLegacy(amount)).rejects.toThrow(
        "Bridge contracts not initialized. Ensure you're on BOB network."
      )
    })

    it("should throw error when no account connected", async () => {
      // Arrange
      const configNoAccount = { ...mockEthereumConfig, account: undefined }
      const bridgeNoAccount = new Bridge(
        configNoAccount,
        mockCrossChainConfig,
        mockMulticall
      )
      ;(bridgeNoAccount as any)._tokenContract = mockTokenContract
      ;(bridgeNoAccount as any)._standardBridgeContract =
        mockStandardBridgeContract
      ;(bridgeNoAccount as any)._ccipContract = {
        address: "0xMockCcipAddress",
      }

      const amount = BigNumber.from("500000000000000000")
      const legacyCap = BigNumber.from("1000000000000000000")
      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)

      // Act & Assert
      await expect(bridgeNoAccount.withdrawLegacy(amount)).rejects.toThrow(
        "No account connected"
      )
    })

    it("should use custom recipient when provided", async () => {
      // Arrange
      const amount = BigNumber.from("500000000000000000")
      const customRecipient = "0x9876543210987654321098765432109876543210"
      const legacyCap = BigNumber.from("1000000000000000000")
      const mockTx = { hash: "0xrecipient123", wait: jest.fn() }

      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)
      mockTokenContract.allowance.mockResolvedValue(
        BigNumber.from("10000000000000000000")
      )
      mockStandardBridgeContract.withdrawTo.mockResolvedValue(mockTx)

      // Act
      const result = await bridge.withdrawLegacy(amount, {
        recipient: customRecipient,
      })

      // Assert
      expect(result).toBe(mockTx)
      expect(mockStandardBridgeContract.withdrawTo).toHaveBeenCalledWith(
        mockTokenContract.address,
        customRecipient,
        amount,
        0,
        "0x",
        {}
      )
    })

    it("should handle approval when needed", async () => {
      // Arrange
      const amount = BigNumber.from("500000000000000000")
      const legacyCap = BigNumber.from("1000000000000000000")
      const mockApprovalTx = { hash: "0xapproval", wait: jest.fn() }
      const mockWithdrawTx = { hash: "0xwithdraw", wait: jest.fn() }

      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)
      mockTokenContract.allowance.mockResolvedValue(BigNumber.from("0")) // No allowance
      mockTokenContract.approve.mockResolvedValue(mockApprovalTx)
      mockStandardBridgeContract.withdrawTo.mockResolvedValue(mockWithdrawTx)

      // Act
      const result = await bridge.withdrawLegacy(amount)

      // Assert
      expect(result).toBe(mockWithdrawTx)
      expect(mockTokenContract.approve).toHaveBeenCalledWith(
        mockStandardBridgeContract.address,
        MaxUint256
      )
      expect(mockApprovalTx.wait).toHaveBeenCalled()
    })

    it("should skip approval when allowance is sufficient", async () => {
      // Arrange
      const amount = BigNumber.from("500000000000000000")
      const legacyCap = BigNumber.from("1000000000000000000")
      const mockTx = { hash: "0xnoApproval", wait: jest.fn() }

      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)
      mockTokenContract.allowance.mockResolvedValue(
        BigNumber.from("1000000000000000000")
      ) // Sufficient allowance
      mockStandardBridgeContract.withdrawTo.mockResolvedValue(mockTx)

      // Act
      const result = await bridge.withdrawLegacy(amount)

      // Assert
      expect(result).toBe(mockTx)
      expect(mockTokenContract.approve).not.toHaveBeenCalled()
    })

    it("should pass gas options to transaction", async () => {
      // Arrange
      const amount = BigNumber.from("500000000000000000")
      const gasLimit = BigNumber.from("300000")
      const maxFeePerGas = BigNumber.from("25000000000") // 25 gwei
      const maxPriorityFeePerGas = BigNumber.from("1500000000") // 1.5 gwei
      const legacyCap = BigNumber.from("1000000000000000000")
      const mockTx = { hash: "0xgas123", wait: jest.fn() }

      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)
      mockTokenContract.allowance.mockResolvedValue(
        BigNumber.from("10000000000000000000")
      )
      mockStandardBridgeContract.withdrawTo.mockResolvedValue(mockTx)

      // Act
      const result = await bridge.withdrawLegacy(amount, {
        gasLimit,
        maxFeePerGas,
        maxPriorityFeePerGas,
      })

      // Assert
      expect(result).toBe(mockTx)
      expect(mockStandardBridgeContract.withdrawTo).toHaveBeenCalledWith(
        mockTokenContract.address,
        mockEthereumConfig.account,
        amount,
        0,
        "0x",
        {
          gasLimit,
          maxFeePerGas,
          maxPriorityFeePerGas,
        }
      )
    })

    it("should use custom deadline when provided", async () => {
      // Arrange
      const amount = BigNumber.from("500000000000000000")
      const deadline = 1234567890
      const legacyCap = BigNumber.from("1000000000000000000")
      const mockTx = { hash: "0xdeadline123", wait: jest.fn() }

      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)
      mockTokenContract.allowance.mockResolvedValue(
        BigNumber.from("10000000000000000000")
      )
      mockStandardBridgeContract.withdrawTo.mockResolvedValue(mockTx)

      // Act
      const result = await bridge.withdrawLegacy(amount, { deadline })

      // Assert
      expect(result).toBe(mockTx)
      expect(mockStandardBridgeContract.withdrawTo).toHaveBeenCalledWith(
        mockTokenContract.address,
        mockEthereumConfig.account,
        amount,
        deadline,
        "0x",
        {}
      )
    })

    it("should handle standard bridge contract call errors", async () => {
      // Arrange
      const amount = BigNumber.from("500000000000000000")
      const legacyCap = BigNumber.from("1000000000000000000")

      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)
      mockTokenContract.allowance.mockResolvedValue(
        BigNumber.from("10000000000000000000")
      )
      mockStandardBridgeContract.withdrawTo.mockRejectedValue(
        new Error("Bridge paused")
      )

      // Act & Assert
      await expect(bridge.withdrawLegacy(amount)).rejects.toThrow(
        "Standard Bridge withdrawal failed: Bridge paused"
      )
    })
  })

  describe("withdrawToL1", () => {
    let bridge: Bridge
    let mockTokenContract: any
    let mockCcipContract: any

    beforeEach(() => {
      mockTokenContract = {
        allowance: jest.fn(),
        approve: jest.fn(),
        legacyCapRemaining: jest.fn(),
        address: "0xMockTokenAddress",
      }

      mockCcipContract = {
        address: "0xMockCcipAddress",
        withdraw: jest.fn(),
      }

      bridge = new Bridge(
        mockEthereumConfig,
        mockCrossChainConfig,
        mockMulticall
      )

      // Manually set the contracts for testing
      ;(bridge as any)._tokenContract = mockTokenContract
      ;(bridge as any)._ccipContract = mockCcipContract
      ;(bridge as any)._standardBridgeContract = {
        address: "0xMockStandardBridgeAddress",
      }
    })

    it("should call withdraw when on BOB network", async () => {
      // Arrange
      const amount = BigNumber.from("1000000000000000000")
      const legacyCap = BigNumber.from("0")
      const mockTx = { hash: "0xwithdrawToL1", wait: jest.fn() }

      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)
      mockTokenContract.allowance.mockResolvedValue(
        BigNumber.from("10000000000000000000")
      )
      mockCcipContract.withdraw.mockResolvedValue(mockTx)

      // Act
      const result = await bridge.withdrawToL1(amount)

      // Assert
      expect(result).toBe(mockTx)
    })

    it("should throw error when not on BOB network", async () => {
      // Arrange
      const nonBobConfig = {
        ...mockEthereumConfig,
        chainId: 1, // Ethereum mainnet
      }
      const bridgeNonBob = new Bridge(
        nonBobConfig,
        mockCrossChainConfig,
        mockMulticall
      )
      const amount = BigNumber.from("1000000000000000000")

      // Act & Assert
      await expect(bridgeNonBob.withdrawToL1(amount)).rejects.toThrow(
        "withdrawToL1 can only be called from BOB network"
      )
    })

    it("should work with BOB testnet", async () => {
      // Arrange
      const bobTestnetConfig = {
        ...mockEthereumConfig,
        chainId: 808813, // BOB testnet
      }
      const bridgeTestnet = new Bridge(
        bobTestnetConfig,
        mockCrossChainConfig,
        mockMulticall
      )
      ;(bridgeTestnet as any)._tokenContract = mockTokenContract
      ;(bridgeTestnet as any)._ccipContract = mockCcipContract
      ;(bridgeTestnet as any)._standardBridgeContract = {
        address: "0xMockStandardBridgeAddress",
      }

      const amount = BigNumber.from("1000000000000000000")
      const legacyCap = BigNumber.from("0")
      const mockTx = { hash: "0xtestnetWithdraw", wait: jest.fn() }

      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)
      mockTokenContract.allowance.mockResolvedValue(
        BigNumber.from("10000000000000000000")
      )
      mockCcipContract.withdraw.mockResolvedValue(mockTx)

      // Act
      const result = await bridgeTestnet.withdrawToL1(amount)

      // Assert
      expect(result).toBe(mockTx)
    })
  })

  describe("quoteFees", () => {
    let bridge: Bridge
    let mockTokenContract: any
    let mockCcipContract: any
    let mockStandardBridgeContract: any
    let mockProvider: any

    beforeEach(() => {
      // Create a mock signer that satisfies ethers Contract requirements
      const mockSigner = {
        provider: {
          _isProvider: true,
          getNetwork: jest
            .fn()
            .mockResolvedValue({ chainId: 60808, name: "bob" }),
        },
        _isSigner: true,
        getAddress: jest
          .fn()
          .mockResolvedValue("0x1234567890123456789012345678901234567890"),
        connectUnchecked: jest.fn().mockReturnThis(),
      }

      // Create mock provider with getGasPrice
      mockProvider = {
        _isProvider: true,
        getSigner: jest.fn().mockReturnValue(mockSigner),
        getNetwork: jest
          .fn()
          .mockResolvedValue({ chainId: 60808, name: "bob" }),
        getGasPrice: jest.fn().mockResolvedValue(BigNumber.from("20000000000")), // 20 gwei
      } as unknown as providers.Provider

      const configWithProvider = {
        ...mockEthereumConfig,
        ethereumProviderOrSigner: mockProvider,
      }

      mockTokenContract = {
        allowance: jest.fn(),
        approve: jest.fn(),
        legacyCapRemaining: jest.fn(),
        address: "0xMockTokenAddress",
      }

      mockCcipContract = {
        address: "0xMockCcipAddress",
        getFee: jest.fn(),
      }

      mockStandardBridgeContract = {
        address: "0xMockStandardBridgeAddress",
      }

      bridge = new Bridge(
        configWithProvider,
        mockCrossChainConfig,
        mockMulticall
      )

      // Manually set the contracts for testing
      ;(bridge as any)._tokenContract = mockTokenContract
      ;(bridge as any)._ccipContract = mockCcipContract
      ;(bridge as any)._standardBridgeContract = mockStandardBridgeContract
    })

    it("should quote CCIP fees when route is explicitly ccip", async () => {
      // Arrange
      const amount = BigNumber.from("1000000000000000000") // 1 tBTC
      const expectedFee = BigNumber.from("3000000000000000") // 0.003 tBTC
      mockCcipContract.getFee.mockResolvedValue(expectedFee)

      // Act
      const quote = await bridge.quoteFees(amount, "ccip")

      // Assert
      expect(quote.route).toBe("ccip")
      expect(quote.fee).toEqual(expectedFee)
      expect(quote.estimatedTime).toBe(3600) // 60 minutes
      expect(quote.breakdown?.ccipFee).toEqual(expectedFee)
      expect(quote.breakdown?.standardFee).toEqual(BigNumber.from(0))
    })

    it("should quote standard fees when route is explicitly standard", async () => {
      // Arrange
      const amount = BigNumber.from("1000000000000000000") // 1 tBTC
      const gasPrice = BigNumber.from("20000000000") // 20 gwei
      const estimatedGas = BigNumber.from("200000")
      const expectedFee = gasPrice.mul(estimatedGas) // 0.004 ETH

      // Act
      const quote = await bridge.quoteFees(amount, "standard")

      // Assert
      expect(quote.route).toBe("standard")
      expect(quote.fee).toEqual(expectedFee)
      expect(quote.estimatedTime).toBe(604800) // 7 days in seconds
      expect(quote.breakdown?.standardFee).toEqual(expectedFee)
      expect(quote.breakdown?.ccipFee).toEqual(BigNumber.from(0))
    })

    it("should automatically determine route when not provided", async () => {
      // Arrange
      const amount = BigNumber.from("500000000000000000") // 0.5 tBTC
      const legacyCap = BigNumber.from("1000000000000000000") // 1 tBTC
      mockTokenContract.legacyCapRemaining.mockResolvedValue(legacyCap)

      // Act
      const quote = await bridge.quoteFees(amount)

      // Assert
      expect(quote.route).toBe("standard")
      expect(mockTokenContract.legacyCapRemaining).toHaveBeenCalled()
    })

    it("should throw error for zero amount", async () => {
      // Act & Assert
      await expect(bridge.quoteFees(BigNumber.from(0))).rejects.toThrow(
        "Amount must be greater than zero"
      )
    })

    it("should throw error for negative amount", async () => {
      // Act & Assert
      await expect(bridge.quoteFees(BigNumber.from(-1000))).rejects.toThrow(
        "Amount must be greater than zero"
      )
    })

    it("should use fallback fee calculation when CCIP getFee fails", async () => {
      // Arrange
      const amount = BigNumber.from("1000000000000000000") // 1 tBTC
      mockCcipContract.getFee.mockRejectedValue(new Error("Network error"))

      // Act
      const quote = await bridge.quoteFees(amount, "ccip")

      // Assert
      expect(quote.route).toBe("ccip")
      // Fallback is 0.3% of amount
      const expectedFee = amount.mul(3).div(1000)
      expect(quote.fee).toEqual(expectedFee)
      expect(quote.estimatedTime).toBe(3600)
    })

    it("should handle CCIP fee calculation with correct parameters", async () => {
      // Arrange
      const amount = BigNumber.from("5000000000000000000") // 5 tBTC
      const expectedFee = BigNumber.from("15000000000000000") // 0.015 tBTC
      mockCcipContract.getFee.mockResolvedValue(expectedFee)

      // Act
      await bridge.quoteFees(amount, "ccip")

      // Assert
      expect(mockCcipContract.getFee).toHaveBeenCalledWith(
        1, // Ethereum chain selector
        {
          token: mockTokenContract.address,
          amount: amount,
          data: "0x",
          receiver: mockEthereumConfig.account,
        }
      )
    })
  })

  describe("quoteDepositFees", () => {
    let bridge: Bridge
    let mockProvider: any

    beforeEach(() => {
      // Create a mock signer that satisfies ethers Contract requirements
      const mockSigner = {
        provider: {
          _isProvider: true,
          getNetwork: jest
            .fn()
            .mockResolvedValue({ chainId: 60808, name: "bob" }),
        },
        _isSigner: true,
        getAddress: jest
          .fn()
          .mockResolvedValue("0x1234567890123456789012345678901234567890"),
        connectUnchecked: jest.fn().mockReturnThis(),
      }

      // Create mock provider with getGasPrice
      mockProvider = {
        _isProvider: true,
        getSigner: jest.fn().mockReturnValue(mockSigner),
        getNetwork: jest
          .fn()
          .mockResolvedValue({ chainId: 60808, name: "bob" }),
        getGasPrice: jest.fn().mockResolvedValue(BigNumber.from("30000000000")), // 30 gwei for L1
      } as unknown as providers.Provider

      const configWithProvider = {
        ...mockEthereumConfig,
        ethereumProviderOrSigner: mockProvider,
      }

      bridge = new Bridge(
        configWithProvider,
        mockCrossChainConfig,
        mockMulticall
      )
    })

    it("should calculate deposit fees for L1 to BOB", async () => {
      // Arrange
      const amount = BigNumber.from("1000000000000000000") // 1 tBTC
      const l1GasPrice = BigNumber.from("30000000000") // 30 gwei
      const estimatedL1Gas = BigNumber.from("150000")
      const l1Fee = l1GasPrice.mul(estimatedL1Gas)

      const l2GasLimit = BigNumber.from("200000")
      const l2GasPrice = BigNumber.from("1000000") // 0.001 gwei
      const l2Fee = l2GasLimit.mul(l2GasPrice)

      const totalFee = l1Fee.add(l2Fee)

      // Act
      const quote = await bridge.quoteDepositFees(amount)

      // Assert
      expect(quote.route).toBe("standard")
      expect(quote.fee).toEqual(totalFee)
      expect(quote.estimatedTime).toBe(900) // 15 minutes
      expect(quote.breakdown?.standardFee).toEqual(totalFee)
      expect(quote.breakdown?.ccipFee).toEqual(BigNumber.from(0))
    })

    it("should handle provider errors gracefully", async () => {
      // Arrange
      const amount = BigNumber.from("1000000000000000000")
      mockProvider.getGasPrice.mockRejectedValue(new Error("RPC error"))

      // Act & Assert
      await expect(bridge.quoteDepositFees(amount)).rejects.toThrow(
        "Fee quotation failed: RPC error"
      )
    })
  })
})
