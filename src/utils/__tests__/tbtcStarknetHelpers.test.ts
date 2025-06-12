import {
  getStarkNetConfig,
  checkStarkNetNetworkCompatibility,
  STARKNET_CONFIGS,
} from "../tbtcStarknetHelpers"

describe("StarkNet Configuration", () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
    // Clear env vars
    delete process.env.REACT_APP_STARKNET_MAINNET
    delete process.env.REACT_APP_STARKNET_SEPOLIA_RELAYER_URL
    delete process.env.REACT_APP_STARKNET_MAINNET_RELAYER_URL
    delete process.env.REACT_APP_DEFAULT_PROVIDER_CHAIN_ID
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe("getStarkNetConfig", () => {
    it("should default to mainnet when no chainId provided", () => {
      // Set environment to mainnet for this test
      process.env.REACT_APP_DEFAULT_PROVIDER_CHAIN_ID = "1"
      // Need to re-import to get the updated environment
      jest.resetModules()
      const { getStarkNetConfig: getConfig } = require("../tbtcStarknetHelpers")

      const config = getConfig()
      expect(config.isTestnet).toBe(false)
      expect(config.chainId).toBe("0x534e5f4d41494e")
      expect(config.chainName).toBe("StarkNet")
    })

    it("should use mainnet when env is true", () => {
      // Set environment to mainnet for this test
      process.env.REACT_APP_DEFAULT_PROVIDER_CHAIN_ID = "1"
      process.env.REACT_APP_STARKNET_MAINNET = "true"
      // Need to re-import to get the updated environment
      jest.resetModules()
      const { getStarkNetConfig: getConfig } = require("../tbtcStarknetHelpers")

      const config = getConfig()
      expect(config.isTestnet).toBe(false)
      expect(config.chainId).toBe("0x534e5f4d41494e")
      expect(config.chainName).toBe("StarkNet")
    })

    it("should use Sepolia when Sepolia chainId is provided", () => {
      // Set environment to Sepolia for this test
      process.env.REACT_APP_DEFAULT_PROVIDER_CHAIN_ID = "11155111"
      // Need to re-import to get the updated environment
      jest.resetModules()
      const { getStarkNetConfig: getConfig } = require("../tbtcStarknetHelpers")

      const config = getConfig("0x534e5f5345504f4c4941")
      expect(config.isTestnet).toBe(true)
      expect(config.chainId).toBe("0x534e5f5345504f4c4941")
      expect(config.chainName).toBe("StarkNet Sepolia")
    })

    it("should have correct relayer URL for mainnet", () => {
      // Set environment to mainnet for this test
      process.env.REACT_APP_DEFAULT_PROVIDER_CHAIN_ID = "1"
      // Need to re-import to get the updated environment
      jest.resetModules()
      const { getStarkNetConfig: getConfig } = require("../tbtcStarknetHelpers")

      const config = getConfig("0x534e5f4d41494e")
      expect(config.relayerUrl).toBe("https://relayer.threshold.network")
    })

    it("should have correct relayer URL for sepolia", () => {
      // Set environment to Sepolia for this test
      process.env.REACT_APP_DEFAULT_PROVIDER_CHAIN_ID = "11155111"
      // Need to re-import to get the updated environment
      jest.resetModules()
      const { getStarkNetConfig: getConfig } = require("../tbtcStarknetHelpers")

      const config = getConfig("0x534e5f5345504f4c4941")
      expect(config.relayerUrl).toBe(
        "https://sepolia-relayer.threshold.network"
      )
    })
  })

  describe("STARKNET_CONFIGS", () => {
    it("should have correct sepolia configuration", () => {
      const sepolia = STARKNET_CONFIGS.sepolia
      expect(sepolia.chainId).toBe("0x534e5f5345504f4c4941")
      expect(sepolia.chainName).toBe("StarkNet Sepolia")
      expect(sepolia.isTestnet).toBe(true)
      expect(sepolia.explorerUrl).toBe("https://sepolia.starkscan.co")
    })

    it("should have correct mainnet configuration", () => {
      const mainnet = STARKNET_CONFIGS.mainnet
      expect(mainnet.chainId).toBe("0x534e5f4d41494e")
      expect(mainnet.chainName).toBe("StarkNet")
      expect(mainnet.isTestnet).toBe(false)
      expect(mainnet.explorerUrl).toBe("https://starkscan.co")
    })

    it("should have l1BitcoinDepositorAddress configured", () => {
      expect(STARKNET_CONFIGS.sepolia.l1BitcoinDepositorAddress).toBeDefined()
      expect(STARKNET_CONFIGS.mainnet.l1BitcoinDepositorAddress).toBeDefined()
      // Should not be empty strings
      expect(STARKNET_CONFIGS.sepolia.l1BitcoinDepositorAddress).not.toBe("")
      expect(STARKNET_CONFIGS.mainnet.l1BitcoinDepositorAddress).not.toBe("")
    })
  })

  describe("checkStarkNetNetworkCompatibility enhanced", () => {
    it("should check compatibility correctly for Sepolia", () => {
      // Set environment to Sepolia for this test
      process.env.REACT_APP_DEFAULT_PROVIDER_CHAIN_ID = "11155111"
      // Need to re-import to get the updated environment
      jest.resetModules()
      const {
        checkStarkNetNetworkCompatibility: checkCompat,
      } = require("../tbtcStarknetHelpers")

      const result = checkCompat(11155111, "0x534e5f5345504f4c4941")
      expect(result.compatible).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it("should check compatibility correctly for mainnet", () => {
      // Set environment to mainnet for this test
      process.env.REACT_APP_DEFAULT_PROVIDER_CHAIN_ID = "1"
      process.env.REACT_APP_STARKNET_MAINNET = "true"
      // Need to re-import to get the updated environment
      jest.resetModules()
      const {
        checkStarkNetNetworkCompatibility: checkCompat,
      } = require("../tbtcStarknetHelpers")

      const result = checkCompat(1, "0x534e5f4d41494e")
      expect(result.compatible).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it("should detect network mismatch", () => {
      // Set environment to Sepolia for this test to enable Sepolia StarkNet
      process.env.REACT_APP_DEFAULT_PROVIDER_CHAIN_ID = "11155111"
      // Need to re-import to get the updated environment
      jest.resetModules()
      const {
        checkStarkNetNetworkCompatibility: checkCompat,
      } = require("../tbtcStarknetHelpers")

      // Sepolia StarkNet config + Mainnet Ethereum (mismatched)
      const result = checkCompat(1, "0x534e5f5345504f4c4941")
      expect(result.compatible).toBe(false)
      expect(result.error).toContain("Network mismatch")
    })

    it("should handle missing parameters", () => {
      const result1 = checkStarkNetNetworkCompatibility(
        undefined,
        "0x534e5f5345504f4c4941"
      )
      expect(result1.compatible).toBe(false)

      const result2 = checkStarkNetNetworkCompatibility(11155111, undefined)
      expect(result2.compatible).toBe(false)
    })
  })
})
