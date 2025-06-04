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
    const { ethereum, bitcoin } = config

    this.multicall = new Multicall(ethereum)
    this.vendingMachines = new VendingMachines(ethereum)
    this.staking = new Staking(ethereum, this.multicall, this.vendingMachines)
    this.multiAppStaking = new MultiAppStaking(
      this.staking,
      this.multicall,
      ethereum
    )
    this.tbtc = new TBTC(ethereum, bitcoin)
  }

  updateConfig = async (config: ThresholdConfig) => {
    this._initialize(config)

    // Handle cross-chain initialization if configured
    if (
      config.crossChain?.isCrossChain &&
      config.crossChain.chainName &&
      config.crossChain.nonEVMProvider
    ) {
      console.log("Initializing cross-chain for:", config.crossChain.chainName)
      try {
        await this.initializeCrossChain(
          config.crossChain.chainName,
          config.crossChain.nonEVMProvider
        )
        console.log("Cross-chain initialization complete")
      } catch (error) {
        console.error("Cross-chain initialization failed:", error)
      }
    }
  }

  initializeCrossChain = async (chainName: string, provider: any) => {
    // Use the public method from TBTC class for cross-chain init
    await this.tbtc.initiateCrossChain(provider, "", chainName)
  }
}
