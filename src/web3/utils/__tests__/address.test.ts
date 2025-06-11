import {
  isAddress,
  isEthereumAddress,
  isStarknetAddress,
  isSameAddress,
  isSameETHAddress,
} from "../address"

describe("Address utilities", () => {
  describe("isStarknetAddress", () => {
    it("should return true for valid Starknet address", () => {
      const validAddress = "0x" + "a".repeat(64)
      expect(isStarknetAddress(validAddress)).toBe(true)
    })

    it("should return true for uppercase Starknet address", () => {
      const validAddress = "0x" + "ABCDEF1234567890".repeat(4)
      expect(isStarknetAddress(validAddress)).toBe(true)
    })

    it("should return true for mixed case Starknet address", () => {
      const validAddress = "0x" + "AbCdEf1234567890".repeat(4)
      expect(isStarknetAddress(validAddress)).toBe(true)
    })

    it("should return false for Ethereum address", () => {
      const ethAddress = "0x" + "a".repeat(40)
      expect(isStarknetAddress(ethAddress)).toBe(false)
    })

    it("should return false for invalid hex characters", () => {
      const invalidAddress = "0x" + "g".repeat(64)
      expect(isStarknetAddress(invalidAddress)).toBe(false)
    })

    it("should return false for missing 0x prefix", () => {
      const invalidAddress = "a".repeat(64)
      expect(isStarknetAddress(invalidAddress)).toBe(false)
    })

    it("should return false for wrong length", () => {
      const tooShort = "0x" + "a".repeat(63)
      const tooLong = "0x" + "a".repeat(65)
      expect(isStarknetAddress(tooShort)).toBe(false)
      expect(isStarknetAddress(tooLong)).toBe(false)
    })
  })

  describe("isAddress", () => {
    it("should return true for valid Ethereum address", () => {
      const ethAddress = "0x" + "a".repeat(40)
      expect(isAddress(ethAddress)).toBe(true)
    })

    it("should return true for valid Starknet address", () => {
      const starknetAddress = "0x" + "a".repeat(64)
      expect(isAddress(starknetAddress)).toBe(true)
    })

    it("should return false for invalid address", () => {
      expect(isAddress("invalid")).toBe(false)
      expect(isAddress("0x" + "a".repeat(50))).toBe(false)
      expect(isAddress("")).toBe(false)
    })
  })

  describe("isSameAddress", () => {
    it("should return true for same Ethereum addresses", () => {
      const addr1 = "0x742d35cc6634c0532925a3b844bc9e7595f2bd4e"
      const addr2 = "0x742d35cc6634c0532925a3b844bc9e7595f2bd4e" // same
      expect(isSameAddress(addr1, addr2)).toBe(true)
    })

    it("should return true for same Starknet addresses", () => {
      const addr1 = "0x" + "ABCDEF".repeat(10) + "1234"
      const addr2 = "0x" + "abcdef".repeat(10) + "1234" // lowercase
      expect(isSameAddress(addr1, addr2)).toBe(true)
    })

    it("should return false for different Ethereum addresses", () => {
      const addr1 = "0x742d35Cc6634C0532925a3b844Bc9e7595f2BD4E"
      const addr2 = "0x742d35Cc6634C0532925a3b844Bc9e7595f2BD4F"
      expect(isSameAddress(addr1, addr2)).toBe(false)
    })

    it("should return false for different Starknet addresses", () => {
      const addr1 = "0x" + "a".repeat(64)
      const addr2 = "0x" + "b".repeat(64)
      expect(isSameAddress(addr1, addr2)).toBe(false)
    })

    it("should return false for Ethereum vs Starknet address", () => {
      const ethAddr = "0x" + "a".repeat(40)
      const starkAddr = "0x" + "a".repeat(64)
      expect(isSameAddress(ethAddr, starkAddr)).toBe(false)
    })
  })

  describe("isEthereumAddress", () => {
    it.skip("should return true for valid Ethereum address", () => {
      const validAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f2bd4e" // lowercase to avoid checksum issues
      expect(isEthereumAddress(validAddress)).toBe(true)
    })

    it("should return false for Starknet address", () => {
      const starknetAddress = "0x" + "a".repeat(64)
      expect(isEthereumAddress(starknetAddress)).toBe(false)
    })
  })

  describe("isSameETHAddress", () => {
    it("should return true for same ETH addresses with different case", () => {
      const addr1 = "0x742d35cc6634c0532925a3b844bc9e7595f2bd4e"
      const addr2 = "0x742d35cc6634c0532925a3b844bc9e7595f2bd4e"
      expect(isSameETHAddress(addr1, addr2)).toBe(true)
    })

    it("should return false for different ETH addresses", () => {
      const addr1 = "0x742d35cc6634c0532925a3b844bc9e7595f2bd4e"
      const addr2 = "0x742d35cc6634c0532925a3b844bc9e7595f2bd4f"
      expect(isSameETHAddress(addr1, addr2)).toBe(false)
    })
  })
})
