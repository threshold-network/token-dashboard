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
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe("getStarkNetConfig", () => {
    it("should default to Sepolia when env not set", () => {
      const config = getStarkNetConfig()
      expect(config.isTestnet).toBe(true)
      expect(config.chainId).toBe("0x534e5f5345504f4c4941")
      expect(config.chainName).toBe("StarkNet Sepolia")
    })

    it("should use mainnet when env is true", () => {
      process.env.REACT_APP_STARKNET_MAINNET = "true"
      const config = getStarkNetConfig()
      expect(config.isTestnet).toBe(false)
      expect(config.chainId).toBe("0x534e5f4d41494e")
      expect(config.chainName).toBe("StarkNet")
    })

    it("should use Sepolia when env is false", () => {
      process.env.REACT_APP_STARKNET_MAINNET = "false"
      const config = getStarkNetConfig()
      expect(config.isTestnet).toBe(true)
      expect(config.chainId).toBe("0x534e5f5345504f4c4941")
    })

    it("should use custom relayer URL from env", () => {
      process.env.REACT_APP_STARKNET_SEPOLIA_RELAYER_URL =
        "https://custom-sepolia.com"
      const config = getStarkNetConfig()
      expect(config.relayerUrl).toBe("https://custom-sepolia.com")
    })

    it("should use default relayer URL when env not set", () => {
      const config = getStarkNetConfig()
      expect(config.relayerUrl).toBeDefined()
      expect(config.relayerUrl).not.toBe("")
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
      const result = checkStarkNetNetworkCompatibility(
        11155111,
        "0x534e5f5345504f4c4941"
      )
      expect(result.compatible).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it("should check compatibility correctly for mainnet", () => {
      process.env.REACT_APP_STARKNET_MAINNET = "true"
      const result = checkStarkNetNetworkCompatibility(1, "0x534e5f4d41494e")
      expect(result.compatible).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it("should detect network mismatch", () => {
      // Sepolia StarkNet config + Mainnet Ethereum
      const result = checkStarkNetNetworkCompatibility(
        1,
        "0x534e5f5345504f4c4941"
      )
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
