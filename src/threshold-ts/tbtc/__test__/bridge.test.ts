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
    mockEthereumConfig = {
      chainId: 60808, // BOB mainnet
      ethereumProviderOrSigner: {} as providers.Provider,
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
})
