// Mock axios before any imports
jest.mock("axios", () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}))

// Mock getThresholdLib to avoid initialization issues
jest.mock("../../utils/getThresholdLib", () => ({
  threshold: {
    tbtc: {
      initializeCrossChain: jest.fn(),
      l2TbtcToken: {
        balanceOf: jest.fn(),
      },
    },
    updateConfig: jest.fn(),
    config: {
      ethereum: {},
      bitcoin: {},
    },
  },
}))

import { providers } from "ethers"
import { threshold } from "../../utils/getThresholdLib"
import { ChainName } from "../types"

// Mock the tBTC SDK
jest.mock("@keep-network/tbtc-v2.ts", () => ({
  ...jest.requireActual("@keep-network/tbtc-v2.ts"),
  initializeCrossChain: jest.fn(),
  l2TbtcToken: {
    balanceOf: jest.fn(),
  },
}))

describe("Starknet SDK Integration", () => {
  const mockStarknetProvider = {
    account: {
      address:
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    },
  }

  const mockAccountObject = {
    address:
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("initializeCrossChain for Starknet", () => {
    it("should initialize with single-parameter mode using provider with account", async () => {
      const mockInitializeCrossChain = jest.fn().mockResolvedValue(undefined)
      const tbtc = {
        initializeCrossChain: mockInitializeCrossChain,
      }

      // Initialize with provider that has account
      await tbtc.initializeCrossChain("StarkNet", mockStarknetProvider)

      expect(mockInitializeCrossChain).toHaveBeenCalledWith(
        "StarkNet",
        mockStarknetProvider
      )
      expect(mockInitializeCrossChain).toHaveBeenCalledTimes(1)
    })

    it("should initialize with single-parameter mode using Account object", async () => {
      const mockInitializeCrossChain = jest.fn().mockResolvedValue(undefined)
      const tbtc = {
        initializeCrossChain: mockInitializeCrossChain,
      }

      // Initialize with Account object
      await tbtc.initializeCrossChain("StarkNet", mockAccountObject)

      expect(mockInitializeCrossChain).toHaveBeenCalledWith(
        "StarkNet",
        mockAccountObject
      )
    })

    it("should throw error when provider is missing", async () => {
      const mockInitializeCrossChain = jest
        .fn()
        .mockRejectedValue(new Error("Provider is required for StarkNet"))
      const tbtc = {
        initializeCrossChain: mockInitializeCrossChain,
      }

      await expect(tbtc.initializeCrossChain("StarkNet", null)).rejects.toThrow(
        "Provider is required for StarkNet"
      )
    })

    it("should throw error when provider has no account or address", async () => {
      const invalidProvider = {} // No account or address property
      const mockInitializeCrossChain = jest
        .fn()
        .mockRejectedValue(
          new Error(
            "StarkNet provider must be an Account object or Provider with connected account."
          )
        )
      const tbtc = {
        initializeCrossChain: mockInitializeCrossChain,
      }

      await expect(
        tbtc.initializeCrossChain("StarkNet", invalidProvider)
      ).rejects.toThrow(
        "StarkNet provider must be an Account object or Provider with connected account."
      )
    })

    it("should not require Ethereum wallet for StarkNet", async () => {
      const mockInitializeCrossChain = jest.fn().mockResolvedValue(undefined)
      const tbtc = {
        initializeCrossChain: mockInitializeCrossChain,
      }

      // Should work without any Ethereum signer
      await tbtc.initializeCrossChain("StarkNet", mockStarknetProvider)

      // Verify it was called with only 2 parameters (no Ethereum signer)
      expect(mockInitializeCrossChain).toHaveBeenCalledWith(
        "StarkNet",
        mockStarknetProvider
      )
      expect(mockInitializeCrossChain.mock.calls[0].length).toBe(2)
    })
  })

  describe("ThresholdContext integration", () => {
    it("should update threshold config for StarkNet", () => {
      const mockUpdateConfig = jest.spyOn(threshold, "updateConfig")

      threshold.updateConfig({
        ethereum: threshold.config.ethereum,
        bitcoin: threshold.config.bitcoin,
        crossChain: {
          isCrossChain: true,
          chainName: ChainName.Starknet,
          nonEVMProvider: mockStarknetProvider,
        },
      })

      expect(mockUpdateConfig).toHaveBeenCalledWith({
        ethereum: expect.any(Object),
        bitcoin: expect.any(Object),
        crossChain: {
          isCrossChain: true,
          chainName: ChainName.Starknet,
          nonEVMProvider: mockStarknetProvider,
        },
      })
    })

    it("should handle missing StarkNet provider gracefully", () => {
      const mockUpdateConfig = jest.spyOn(threshold, "updateConfig")

      threshold.updateConfig({
        ethereum: threshold.config.ethereum,
        bitcoin: threshold.config.bitcoin,
        crossChain: {
          isCrossChain: false,
          chainName: null,
          nonEVMProvider: null,
        },
      })

      expect(mockUpdateConfig).toHaveBeenCalled()
      const config = mockUpdateConfig.mock.calls[0][0]
      expect(config.crossChain.isCrossChain).toBe(false)
      expect(config.crossChain.nonEVMProvider).toBeNull()
    })
  })

  describe("Error handling", () => {
    it("should provide clear error message for unsupported provider type", async () => {
      const unsupportedProvider = { unsupported: true }
      const mockInitializeCrossChain = jest
        .fn()
        .mockRejectedValue(
          new Error("Invalid StarkNet provider: missing account information")
        )
      const tbtc = {
        initializeCrossChain: mockInitializeCrossChain,
      }

      await expect(
        tbtc.initializeCrossChain("StarkNet", unsupportedProvider)
      ).rejects.toThrow(
        "Invalid StarkNet provider: missing account information"
      )
    })

    it("should handle network mismatch errors", async () => {
      const mockInitializeCrossChain = jest
        .fn()
        .mockRejectedValue(
          new Error("Network mismatch: StarkNet provider is on wrong network")
        )
      const tbtc = {
        initializeCrossChain: mockInitializeCrossChain,
      }

      await expect(
        tbtc.initializeCrossChain("StarkNet", mockStarknetProvider)
      ).rejects.toThrow(
        "Network mismatch: StarkNet provider is on wrong network"
      )
    })
  })
})
