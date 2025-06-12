import { MultiAppStaking } from "./mas"
import { IMulticall, Multicall } from "./multicall"
import { IStaking, Staking } from "./staking"
import { ITBTC, TBTC } from "./tbtc"
import { ThresholdConfig } from "./types"
import { IVendingMachines, VendingMachines } from "./vending-machine"

export class Threshold {
  config!: ThresholdConfig
  multicall!: IMulticall
  staking!: IStaking
  multiAppStaking!: MultiAppStaking
  vendingMachines!: IVendingMachines
  tbtc!: ITBTC

  constructor(config: ThresholdConfig) {
    this._initialize(config)
  }

  private _initialize = (config: ThresholdConfig) => {
    this.config = config
    const { ethereum, bitcoin, crossChain } = config

    this.multicall = new Multicall(ethereum)
    this.vendingMachines = new VendingMachines(ethereum)
    this.staking = new Staking(ethereum, this.multicall, this.vendingMachines)
    this.multiAppStaking = new MultiAppStaking(
      this.staking,
      this.multicall,
      ethereum
    )
    this.tbtc = new TBTC(ethereum, bitcoin, crossChain)
  }

  updateConfig = async (config: ThresholdConfig) => {
    try {
      this._initialize(config)

      // Wait for tBTC SDK initialization to complete (or fail gracefully)
      try {
        await this.tbtc._sdkPromise
      } catch (sdkError) {
        console.warn(
          "tBTC SDK initialization failed, some features may be limited:",
          sdkError
        )
      }

      // Handle cross-chain initialization if configured
      if (config.crossChain?.isCrossChain) {
        // For non-EVM chains (like StarkNet), use the nonEVMProvider
        if (config.crossChain.chainName && config.crossChain.nonEVMProvider) {
          // Convert ChainName enum to SDK expected string
          const sdkChainName =
            config.crossChain.chainName === "Starknet"
              ? "StarkNet"
              : config.crossChain.chainName

          try {
            await this.initializeCrossChain(
              sdkChainName,
              config.crossChain.nonEVMProvider
            )
          } catch (error: any) {
            // If it's a disabled network error, handle it silently
            if (error.message?.includes("disabled")) {
              return
            }
            console.error("Cross-chain initialization failed:", error)
            // Note: This is expected for StarkNet until contracts are deployed
            // The SDK has placeholder contracts that need to be updated with real addresses
          }
        } else if (
          config.ethereum?.providerOrSigner &&
          config.ethereum?.account
        ) {
          // For EVM L2 chains (like Base, Arbitrum), initialize using the ethereum provider
          console.log("Initializing cross-chain for EVM L2")
          try {
            await this.tbtc.initiateCrossChain(
              config.ethereum.providerOrSigner,
              config.ethereum.account
            )
            console.log("EVM L2 cross-chain initialization complete")
          } catch (error) {
            console.error("EVM L2 cross-chain initialization failed:", error)
          }
        }
      }
    } catch (error: any) {
      console.error("Failed to update Threshold config:", error)
      // Re-throw to be caught by ThresholdContext
      throw error
    }
  }

  initializeCrossChain = async (chainName: string, provider: any) => {
    // Use the public method from TBTC class for cross-chain init
    await this.tbtc.initiateCrossChain(provider, "", chainName)
  }
}
