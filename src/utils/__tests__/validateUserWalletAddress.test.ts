import { validateUserWalletAddress } from "../forms"

describe("validateUserWalletAddress", () => {
  describe("should return error message", () => {
    it("for empty address", () => {
      const result = validateUserWalletAddress("")
      expect(result).toBe("Required.")
    })

    it("for invalid Ethereum address", () => {
      const result = validateUserWalletAddress("0xinvalid")
      expect(result).toBe("Invalid address.")
    })

    it("for invalid StarkNet address", () => {
      const result = validateUserWalletAddress("0x123")
      expect(result).toBe("Invalid address.")
    })

    it("for zero address", () => {
      const result = validateUserWalletAddress(
        "0x0000000000000000000000000000000000000000"
      )
      expect(result).toBe("Address is a zero address.")
    })
  })

  describe("should return undefined for valid addresses", () => {
    it("for valid lowercase Ethereum address", () => {
      const validEthAddress = "0x" + "a".repeat(40)
      const result = validateUserWalletAddress(validEthAddress)
      expect(result).toBeUndefined()
    })

    it("for valid StarkNet address", () => {
      const validStarknetAddress = "0x" + "a".repeat(64)
      const result = validateUserWalletAddress(validStarknetAddress)
      expect(result).toBeUndefined()
    })

    it("for valid mixed case StarkNet address", () => {
      const mixedCaseStarknetAddress = "0x" + "AbCdEf1234567890".repeat(4)
      const result = validateUserWalletAddress(mixedCaseStarknetAddress)
      expect(result).toBeUndefined()
    })
  })
})
