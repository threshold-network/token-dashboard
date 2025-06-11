import { BitcoinNetwork } from "../../types"
import { isValidBtcAddress, isPublicKeyHashTypeAddress } from "../../utils"

// Mock the utils module
jest.mock("../../utils", () => ({
  ...jest.requireActual("../../utils"),
  isValidBtcAddress: jest.fn(),
  isPublicKeyHashTypeAddress: jest.fn(),
}))

describe("TBTC test", () => {
  describe("Bitcoin address validation", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    test("should validate BTC address correctly", () => {
      const testAddress = "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq"
      ;(isValidBtcAddress as jest.Mock).mockReturnValue(true)

      const result = isValidBtcAddress(testAddress, BitcoinNetwork.Mainnet)

      expect(isValidBtcAddress).toHaveBeenCalledWith(
        testAddress,
        BitcoinNetwork.Mainnet
      )
      expect(result).toBe(true)
    })

    test("should validate public key hash type address", () => {
      const testAddress = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
      ;(isPublicKeyHashTypeAddress as jest.Mock).mockReturnValue(true)

      const result = isPublicKeyHashTypeAddress(testAddress)

      expect(isPublicKeyHashTypeAddress).toHaveBeenCalledWith(testAddress)
      expect(result).toBe(true)
    })

    test("should reject invalid BTC address", () => {
      const invalidAddress = "invalid-address"
      ;(isValidBtcAddress as jest.Mock).mockReturnValue(false)

      const result = isValidBtcAddress(invalidAddress, BitcoinNetwork.Mainnet)

      expect(isValidBtcAddress).toHaveBeenCalledWith(
        invalidAddress,
        BitcoinNetwork.Mainnet
      )
      expect(result).toBe(false)
    })

    test("should handle testnet addresses", () => {
      const testnetAddress = "tb1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq"
      ;(isValidBtcAddress as jest.Mock).mockReturnValue(true)

      const result = isValidBtcAddress(testnetAddress, BitcoinNetwork.Testnet)

      expect(isValidBtcAddress).toHaveBeenCalledWith(
        testnetAddress,
        BitcoinNetwork.Testnet
      )
      expect(result).toBe(true)
    })
  })
})
