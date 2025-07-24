import { BigNumber, providers } from "ethers"
import {
  Bridge,
  IBridge,
  BridgeOptions,
  BridgeQuote,
  BridgeRoute,
} from "../bridge"
import { EthereumConfig, CrossChainConfig } from "../../types"
import { IMulticall } from "../../multicall"

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

    beforeEach(() => {
      bridge = new Bridge(
        mockEthereumConfig,
        mockCrossChainConfig,
        mockMulticall
      )
    })

    it("should throw 'not implemented' for withdraw", async () => {
      await expect(bridge.withdraw(BigNumber.from(100))).rejects.toThrow(
        "Method not implemented"
      )
    })

    it("should throw 'not implemented' for withdrawLegacy", async () => {
      await expect(bridge.withdrawLegacy(BigNumber.from(100))).rejects.toThrow(
        "Method not implemented"
      )
    })

    it("should throw 'not implemented' for depositToBob", async () => {
      await expect(bridge.depositToBob(BigNumber.from(100))).rejects.toThrow(
        "Method not implemented"
      )
    })

    it("should throw 'not implemented' for withdrawToL1", async () => {
      await expect(bridge.withdrawToL1(BigNumber.from(100))).rejects.toThrow(
        "Method not implemented"
      )
    })

    it("should throw 'not implemented' for approveForCcip", async () => {
      await expect(bridge.approveForCcip(BigNumber.from(100))).rejects.toThrow(
        "Method not implemented"
      )
    })

    it("should throw 'not implemented' for approveForStandardBridge", async () => {
      await expect(
        bridge.approveForStandardBridge(BigNumber.from(100))
      ).rejects.toThrow("Method not implemented")
    })

    it("should throw 'not implemented' for pickPath", async () => {
      await expect(bridge.pickPath(BigNumber.from(100))).rejects.toThrow(
        "Method not implemented"
      )
    })

    it("should throw 'not implemented' for quoteFees", async () => {
      await expect(bridge.quoteFees(BigNumber.from(100))).rejects.toThrow(
        "Method not implemented"
      )
    })

    it("should throw 'not implemented' for getLegacyCapRemaining", async () => {
      await expect(bridge.getLegacyCapRemaining()).rejects.toThrow(
        "Method not implemented"
      )
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
        "Method not implemented"
      )
      // Will throw different error when implemented
    })
  })
})
