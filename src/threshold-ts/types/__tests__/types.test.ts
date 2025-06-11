import { ChainName, CrossChainConfig, ThresholdConfig } from "../index"

describe("Threshold Types", () => {
  describe("ChainName enum", () => {
    it("should have Ethereum value", () => {
      expect(ChainName.Ethereum).toBe("Ethereum")
    })

    it("should have Solana value", () => {
      expect(ChainName.Solana).toBe("Solana")
    })

    it("should have Starknet value", () => {
      expect(ChainName.Starknet).toBe("Starknet")
    })

    it("should have exactly 3 values", () => {
      const values = Object.values(ChainName)
      expect(values).toHaveLength(3)
    })
  })

  describe("CrossChainConfig type", () => {
    it("should accept valid cross-chain config", () => {
      const config: CrossChainConfig = {
        isCrossChain: true,
        chainName: ChainName.Starknet,
        nonEVMProvider: {} as any,
      }
      expect(config.isCrossChain).toBe(true)
      expect(config.chainName).toBe(ChainName.Starknet)
    })

    it("should accept null values", () => {
      const config: CrossChainConfig = {
        isCrossChain: false,
        chainName: null,
        nonEVMProvider: null,
      }
      expect(config.chainName).toBeNull()
      expect(config.nonEVMProvider).toBeNull()
    })
  })

  describe("ThresholdConfig interface", () => {
    it("should accept config without crossChain", () => {
      const config: ThresholdConfig = {
        ethereum: {
          providerOrSigner: {} as any,
          chainId: 1,
          shouldUseTestnetDevelopmentContracts: false,
        },
        bitcoin: {
          network: "mainnet" as any,
        },
      }
      expect(config.crossChain).toBeUndefined()
    })

    it("should accept config with crossChain", () => {
      const config: ThresholdConfig = {
        ethereum: {
          providerOrSigner: {} as any,
          chainId: 1,
          shouldUseTestnetDevelopmentContracts: false,
        },
        bitcoin: {
          network: "mainnet" as any,
        },
        crossChain: {
          isCrossChain: true,
          chainName: ChainName.Starknet,
          nonEVMProvider: {} as any,
        },
      }
      expect(config.crossChain).toBeDefined()
      expect(config.crossChain?.chainName).toBe(ChainName.Starknet)
    })
  })
})
