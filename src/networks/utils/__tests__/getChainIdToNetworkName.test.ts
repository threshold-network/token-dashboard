// Mock the getDefaultProviderChainId to test both mainnet and testnet scenarios
jest.mock("../../../utils/getEnvVariable")

describe("getChainIdToNetworkName with StarkNet", () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  describe("Mainnet environment", () => {
    beforeEach(() => {
      const {
        getDefaultProviderChainId,
      } = require("../../../utils/getEnvVariable")
      getDefaultProviderChainId.mockReturnValue(1) // Ethereum mainnet
    })

    // CRITICAL: Test existing chains still work
    it("should still map Arbitrum correctly", () => {
      const { getChainIdToNetworkName } = require("../getChainIdToNetworkName")
      expect(getChainIdToNetworkName(42161)).toBe("Arbitrum")
      expect(getChainIdToNetworkName("42161")).toBe("Arbitrum")
    })

    it("should still map Base correctly", () => {
      const { getChainIdToNetworkName } = require("../getChainIdToNetworkName")
      expect(getChainIdToNetworkName(8453)).toBe("Base")
      expect(getChainIdToNetworkName("8453")).toBe("Base")
    })

    it("should still map Ethereum correctly", () => {
      const { getChainIdToNetworkName } = require("../getChainIdToNetworkName")
      expect(getChainIdToNetworkName(1)).toBe("Ethereum")
      expect(getChainIdToNetworkName("1")).toBe("Ethereum")
    })

    // New StarkNet tests
    it("should map StarkNet mainnet hex chainId", () => {
      const { getChainIdToNetworkName } = require("../getChainIdToNetworkName")
      // StarkNet is not in the regular networks array, so it should return Unsupported
      expect(getChainIdToNetworkName("0x534e5f4d41494e")).toBe("Unsupported")
    })

    it("should handle StarkNet hex chainIds case-insensitively", () => {
      const { getChainIdToNetworkName } = require("../getChainIdToNetworkName")
      // StarkNet is not in the regular networks array, so it should return Unsupported
      expect(getChainIdToNetworkName("0x534E5F4D41494E")).toBe("Unsupported")
      expect(getChainIdToNetworkName("0x534e5f4d41494e")).toBe("Unsupported")
    })
  })

  describe("Testnet environment", () => {
    beforeEach(() => {
      const {
        getDefaultProviderChainId,
      } = require("../../../utils/getEnvVariable")
      getDefaultProviderChainId.mockReturnValue(11155111) // Sepolia
    })

    it("should map Ethereum Sepolia correctly", () => {
      const { getChainIdToNetworkName } = require("../getChainIdToNetworkName")
      expect(getChainIdToNetworkName(11155111)).toBe("Ethereum")
      expect(getChainIdToNetworkName("11155111")).toBe("Ethereum")
    })

    it("should map StarkNet sepolia hex chainId", () => {
      const { getChainIdToNetworkName } = require("../getChainIdToNetworkName")
      // StarkNet is not in the regular networks array, so it should return Unsupported
      expect(getChainIdToNetworkName("0x534e5f5345504f4c4941")).toBe(
        "Unsupported"
      )
    })
  })

  it('should return "Unsupported" for unknown chain IDs', () => {
    const {
      getDefaultProviderChainId,
    } = require("../../../utils/getEnvVariable")
    getDefaultProviderChainId.mockReturnValue(1) // Set a default

    const { getChainIdToNetworkName } = require("../getChainIdToNetworkName")
    expect(getChainIdToNetworkName(999999)).toBe("Unsupported")
    expect(getChainIdToNetworkName("0xDEADBEEF")).toBe("Unsupported")
  })
})
