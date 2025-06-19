import {
  hexToNumber,
  toHex,
  compareChainIds,
} from "../../networks/utils/chainId"
import {
  isValidStarkNetAddress,
  checkStarkNetNetworkCompatibility,
  getStarkNetConfig,
} from "../../utils/tbtcStarknetHelpers"

// Mock getEthereumDefaultProviderChainId
jest.mock("../../utils/getEnvVariable")

// Mock environment variables
const originalEnv = process.env

beforeEach(() => {
  jest.resetModules()
  jest.clearAllMocks()
  process.env = { ...originalEnv }
  delete process.env.REACT_APP_DEFAULT_PROVIDER_CHAIN_ID
  const {
    getEthereumDefaultProviderChainId,
  } = require("../../utils/getEnvVariable")
  getEthereumDefaultProviderChainId.mockReturnValue(1) // Default to mainnet
})

afterEach(() => {
  process.env = originalEnv
  jest.clearAllMocks()
})

describe("Backwards Compatibility Suite", () => {
  describe("Arbitrum Deposits", () => {
    it("should map Arbitrum chainId correctly", () => {
      // Import after mocks are set
      const {
        getChainIdToNetworkName,
      } = require("../../networks/utils/getChainIdToNetworkName")

      // Test numeric chainId
      expect(getChainIdToNetworkName(42161)).toBe("Arbitrum")
      // Test string chainId
      expect(getChainIdToNetworkName("42161")).toBe("Arbitrum")
      // Test hex chainId
      expect(getChainIdToNetworkName("0xa4b1")).toBe("Arbitrum")
    })

    it("should handle Arbitrum hex conversion correctly", () => {
      expect(hexToNumber("0xa4b1")).toBe(42161)
      expect(hexToNumber(42161)).toBe(42161)
      expect(hexToNumber("42161")).toBe(42161)
    })

    it("should not affect Arbitrum with StarkNet functions", () => {
      // StarkNet validation should not interfere with Arbitrum addresses
      expect(isValidStarkNetAddress("0xArbitrumAddress123")).toBe(false)

      // Network compatibility check should handle non-StarkNet chains gracefully
      const result = checkStarkNetNetworkCompatibility(1, "0xa4b1")
      expect(result.compatible).toBe(false)
      expect(result.error).toContain(
        "The connected StarkNet network is not enabled"
      )
    })
  })

  describe("Base Deposits", () => {
    it("should map Base chainId exactly as before", () => {
      // Import after mocks are set
      const {
        getChainIdToNetworkName,
      } = require("../../networks/utils/getChainIdToNetworkName")

      // Test numeric chainId
      expect(getChainIdToNetworkName(8453)).toBe("Base")
      // Test string chainId
      expect(getChainIdToNetworkName("8453")).toBe("Base")
      // Test hex chainId
      expect(getChainIdToNetworkName("0x2105")).toBe("Base")
    })

    it("should handle Base hex conversion correctly", () => {
      expect(hexToNumber("0x2105")).toBe(8453)
      expect(hexToNumber(8453)).toBe(8453)
      expect(hexToNumber("8453")).toBe(8453)
    })
  })

  describe("Ethereum Standard Minting", () => {
    it("should map Ethereum mainnet exactly as before", () => {
      // Import after mocks are set
      const {
        getChainIdToNetworkName,
      } = require("../../networks/utils/getChainIdToNetworkName")

      expect(getChainIdToNetworkName(1)).toBe("Ethereum")
      expect(getChainIdToNetworkName("1")).toBe("Ethereum")
      expect(getChainIdToNetworkName("0x1")).toBe("Ethereum")
    })

    it("should map Ethereum Sepolia exactly as before", () => {
      // Set testnet environment
      const {
        getEthereumDefaultProviderChainId,
      } = require("../../utils/getEnvVariable")
      getEthereumDefaultProviderChainId.mockReturnValue(11155111)

      // Clear module cache and re-import
      jest.resetModules()
      const {
        getChainIdToNetworkName,
      } = require("../../networks/utils/getChainIdToNetworkName")

      expect(getChainIdToNetworkName(11155111)).toBe("Ethereum")
      expect(getChainIdToNetworkName("11155111")).toBe("Ethereum")
      expect(getChainIdToNetworkName("0xaa36a7")).toBe("Ethereum")
    })
  })

  describe("StarkNet New Functionality", () => {
    it("should work with mainnet config by default when provider is mainnet", () => {
      // Set environment to mainnet for this test
      process.env.REACT_APP_DEFAULT_PROVIDER_CHAIN_ID = "1"
      // Need to re-import to get the updated environment
      jest.resetModules()
      const { getStarkNetConfig } = require("../../utils/tbtcStarknetHelpers")

      // Default mainnet config
      const config = getStarkNetConfig()

      expect(config.isTestnet).toBe(false)
      expect(config.chainId).toBe("0x534e5f4d41494e")
      expect(config.chainName).toBe("StarkNet")
    })

    it("should work with Sepolia config when Sepolia chainId is provided", () => {
      // Set environment to Sepolia for this test
      process.env.REACT_APP_DEFAULT_PROVIDER_CHAIN_ID = "11155111"
      // Need to re-import to get the updated environment
      jest.resetModules()
      const { getStarkNetConfig } = require("../../utils/tbtcStarknetHelpers")

      // Pass the Sepolia chainId explicitly
      const config = getStarkNetConfig("0x534e5f5345504f4c4941")

      expect(config.isTestnet).toBe(true)
      expect(config.chainId).toBe("0x534e5f5345504f4c4941")
      expect(config.chainName).toBe("StarkNet Sepolia")
    })

    it("should validate StarkNet addresses correctly", () => {
      // Valid StarkNet addresses (must be at least 40 hex chars)
      expect(
        isValidStarkNetAddress("0x1234567890abcdef1234567890abcdef12345678")
      ).toBe(true)
      expect(
        isValidStarkNetAddress(
          "0x06ac597f8116f886fa1c97a23fa4e08299975ecaf6b598873ca6792b9bbfb678"
        )
      ).toBe(true)

      // Invalid addresses (too short)
      expect(isValidStarkNetAddress("0x1234567890abcdef")).toBe(false)
      expect(isValidStarkNetAddress("0xInvalid")).toBe(false)
      expect(isValidStarkNetAddress("not-an-address")).toBe(false)
      expect(isValidStarkNetAddress("")).toBe(false)
      expect(isValidStarkNetAddress(undefined as any)).toBe(false)
    })

    it("should check network compatibility correctly", () => {
      // Set environment to Sepolia for this test
      process.env.REACT_APP_DEFAULT_PROVIDER_CHAIN_ID = "11155111"
      // Need to re-import to get the updated environment
      jest.resetModules()
      const {
        checkStarkNetNetworkCompatibility,
      } = require("../../utils/tbtcStarknetHelpers")

      // Sepolia compatibility
      const sepoliaResult = checkStarkNetNetworkCompatibility(
        11155111,
        "0x534e5f5345504f4c4941"
      )
      expect(sepoliaResult.compatible).toBe(true)
      expect(sepoliaResult.error).toBeUndefined()

      // Reset for mainnet test
      process.env.REACT_APP_DEFAULT_PROVIDER_CHAIN_ID = "1"
      jest.resetModules()
      const {
        checkStarkNetNetworkCompatibility: checkCompatMainnet,
      } = require("../../utils/tbtcStarknetHelpers")

      // Mainnet compatibility
      const mainnetResult = checkCompatMainnet(1, "0x534e5f4d41494e")
      expect(mainnetResult.compatible).toBe(true)
      expect(mainnetResult.error).toBeUndefined()

      // Mismatch detection
      const mismatchResult = checkStarkNetNetworkCompatibility(
        1,
        "0x534e5f5345504f4c4941"
      )
      expect(mismatchResult.compatible).toBe(false)
      expect(mismatchResult.error).toContain("Network mismatch")
    })
  })

  describe("Chain ID Edge Cases", () => {
    it("should handle unknown chain IDs without breaking", () => {
      const {
        getChainIdToNetworkName,
      } = require("../../networks/utils/getChainIdToNetworkName")

      expect(getChainIdToNetworkName(999999)).toBe("Unsupported")
      expect(getChainIdToNetworkName("0xDEADBEEF")).toBe("Unsupported")
      expect(getChainIdToNetworkName(undefined as any)).toBe("Unsupported")
      expect(getChainIdToNetworkName(null as any)).toBe("Unsupported")
    })

    it("should handle very large hex values gracefully", () => {
      // Should not throw, even with very large hex values
      expect(() => hexToNumber("0xFFFFFFFFFFFFFFFF")).not.toThrow()

      const {
        getChainIdToNetworkName,
      } = require("../../networks/utils/getChainIdToNetworkName")
      expect(() => getChainIdToNetworkName("0xFFFFFFFFFFFFFFFF")).not.toThrow()
    })
  })

  describe("Performance and Memory", () => {
    it("should not increase memory usage significantly", () => {
      // Set a valid chain ID for this test
      const originalChainId = process.env.REACT_APP_DEFAULT_PROVIDER_CHAIN_ID
      process.env.REACT_APP_DEFAULT_PROVIDER_CHAIN_ID = "1"

      // Clear module cache to pick up new env
      jest.resetModules()

      // Test that repeated calls don't leak memory
      const {
        getChainIdToNetworkName,
      } = require("../../networks/utils/getChainIdToNetworkName")
      const { getStarkNetConfig } = require("../../utils/tbtcStarknetHelpers")

      const initialMemory = process.memoryUsage().heapUsed

      for (let i = 0; i < 1000; i++) {
        getChainIdToNetworkName(42161)
        getChainIdToNetworkName(8453)
        getChainIdToNetworkName("0x534e5f4d41494e")
        getStarkNetConfig()
      }

      const finalMemory = process.memoryUsage().heapUsed
      const memoryIncrease = finalMemory - initialMemory

      // Restore original chain ID
      process.env.REACT_APP_DEFAULT_PROVIDER_CHAIN_ID = originalChainId

      // Memory increase should be minimal (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024)
    })

    it("should handle chainId conversion quickly", () => {
      const start = performance.now()

      for (let i = 0; i < 10000; i++) {
        hexToNumber("0xa4b1")
        hexToNumber("0x2105")
        hexToNumber("0x534e5f4d41494e")
      }

      const end = performance.now()
      const duration = end - start

      // Should complete 30k conversions in less than 200ms
      expect(duration).toBeLessThan(200)
    })
  })

  describe("Chain ID Utility Functions", () => {
    it("toHex should maintain backwards compatibility for all chains", () => {
      // Ethereum
      expect(toHex(1)).toBe("0x1")
      expect(toHex("1")).toBe("0x1")
      expect(toHex("0x1")).toBe("0x1")

      // Arbitrum
      expect(toHex(42161)).toBe("0xa4b1")
      expect(toHex("42161")).toBe("0xa4b1")
      expect(toHex("0xa4b1")).toBe("0xa4b1")

      // Base
      expect(toHex(8453)).toBe("0x2105")
      expect(toHex("8453")).toBe("0x2105")
      expect(toHex("0x2105")).toBe("0x2105")

      // StarkNet - should not throw overflow error
      const starknetHex = "0x534e5f4d41494e"
      expect(() => toHex(starknetHex)).not.toThrow()
      expect(toHex(starknetHex)).toBe(starknetHex)
    })

    it("compareChainIds should work correctly for all chain combinations", () => {
      // Same chain comparisons
      expect(compareChainIds(1, 1)).toBe(true)
      expect(compareChainIds(42161, 42161)).toBe(true)
      expect(compareChainIds(8453, 8453)).toBe(true)

      // Different format comparisons
      expect(compareChainIds("0xa4b1", 42161)).toBe(true)
      expect(compareChainIds("0x2105", 8453)).toBe(true)
      expect(compareChainIds("1", 1)).toBe(true)

      // Cross-chain comparisons should return false
      expect(compareChainIds(1, 42161)).toBe(false)
      expect(compareChainIds(8453, 42161)).toBe(false)
      expect(compareChainIds("0x534e5f4d41494e", 1)).toBe(false)
    })

    it("should handle StarkNet's large hex values without BigNumber overflow", () => {
      // These used to cause "overflow" errors
      const starknetMainnet = "0x534e5f4d41494e"
      const starknetSepolia = "0x534e5f5345504f4c4941"

      // toHex should return the value as-is for hex strings
      expect(() => toHex(starknetMainnet)).not.toThrow()
      expect(() => toHex(starknetSepolia)).not.toThrow()
      expect(toHex(starknetMainnet)).toBe(starknetMainnet)
      expect(toHex(starknetSepolia)).toBe(starknetSepolia)

      // hexToNumber should handle StarkNet chain IDs
      expect(() => hexToNumber(starknetMainnet)).not.toThrow()
      expect(() => hexToNumber(starknetSepolia)).not.toThrow()
    })
  })
})
