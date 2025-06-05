import { getChainIdToNetworkName } from "../getChainIdToNetworkName"

// Mock the getDefaultProviderChainId to test both mainnet and testnet scenarios
jest.mock("../../../utils/getEnvVariable", () => ({
  ...jest.requireActual("../../../utils/getEnvVariable"),
  getDefaultProviderChainId: jest.fn(),
}))

import { getDefaultProviderChainId } from "../../../utils/getEnvVariable"

describe("getChainIdToNetworkName with StarkNet", () => {
  describe("Mainnet environment", () => {
    beforeEach(() => {
      ;(getDefaultProviderChainId as jest.Mock).mockReturnValue(1) // Ethereum mainnet
    })

    // CRITICAL: Test existing chains still work
    it("should still map Arbitrum correctly", () => {
      expect(getChainIdToNetworkName(42161)).toBe("Arbitrum")
      expect(getChainIdToNetworkName("42161")).toBe("Arbitrum")
    })

    it("should still map Base correctly", () => {
      expect(getChainIdToNetworkName(8453)).toBe("Base")
      expect(getChainIdToNetworkName("8453")).toBe("Base")
    })

    it("should still map Ethereum correctly", () => {
      expect(getChainIdToNetworkName(1)).toBe("Ethereum")
      expect(getChainIdToNetworkName("1")).toBe("Ethereum")
    })

    // New StarkNet tests
    it("should map StarkNet mainnet hex chainId", () => {
      expect(getChainIdToNetworkName("0x534e5f4d41494e")).toBe("StarkNet")
    })

    it("should handle StarkNet hex chainIds case-insensitively", () => {
      expect(getChainIdToNetworkName("0x534E5F4D41494E")).toBe("StarkNet")
      expect(getChainIdToNetworkName("0x534e5f4d41494e")).toBe("StarkNet")
    })
  })

  describe("Testnet environment", () => {
    beforeEach(() => {
      ;(getDefaultProviderChainId as jest.Mock).mockReturnValue(11155111) // Sepolia
    })

    it("should map Ethereum Sepolia correctly", () => {
      expect(getChainIdToNetworkName(11155111)).toBe("Ethereum")
      expect(getChainIdToNetworkName("11155111")).toBe("Ethereum")
    })

    it("should map StarkNet sepolia hex chainId", () => {
      expect(getChainIdToNetworkName("0x534e5f5345504f4c4941")).toBe("StarkNet")
    })
  })

  it('should return "Unsupported" for unknown chain IDs', () => {
    expect(getChainIdToNetworkName(999999)).toBe("Unsupported")
    expect(getChainIdToNetworkName("0xDEADBEEF")).toBe("Unsupported")
  })
})
