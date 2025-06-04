import shortenAddress from "../shortenAddress"

describe("shortenAddress", () => {
  describe("Ethereum addresses", () => {
    const ethAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f2BD4E"

    it("should shorten Ethereum address with default slice", () => {
      expect(shortenAddress(ethAddress)).toBe("0x742d...BD4E")
    })

    it("should shorten Ethereum address with custom slice", () => {
      expect(shortenAddress(ethAddress, -6)).toBe("0x742d35...f2BD4E")
    })
  })

  describe("Starknet addresses", () => {
    const starknetAddress =
      "0x04a909347487d909a6629b56880e6e03ad3859e772048c4481f3fba88ea02c32f"

    it("should shorten Starknet address with default slice", () => {
      expect(shortenAddress(starknetAddress)).toBe("0x04a9...c32f")
    })

    it("should shorten Starknet address with custom slice", () => {
      expect(shortenAddress(starknetAddress, -6)).toBe("0x04a909...02c32f")
    })
  })

  describe("Non-0x addresses (Solana-like)", () => {
    const solanaAddress = "7EYnhQoR9YM3N7UoaKRoA44Uy8JeaZV3qyouov87awMs"

    it("should shorten Solana-like address", () => {
      // For 44 character address, should show 6 chars on each side
      expect(shortenAddress(solanaAddress)).toBe("7EYnhQ...87awMs")
    })

    it("should handle shorter non-0x addresses", () => {
      const shortAddress = "ABC123DEF456"
      // For 12 character address, should show 3 chars on each side
      expect(shortenAddress(shortAddress)).toBe("ABC...456")
    })
  })

  describe("Edge cases", () => {
    it("should return empty string for undefined", () => {
      expect(shortenAddress(undefined)).toBe("")
    })

    it("should return empty string for empty string", () => {
      expect(shortenAddress("")).toBe("")
    })

    it("should handle very short addresses", () => {
      expect(shortenAddress("0x123")).toBe("0x...123")
    })
  })
})
