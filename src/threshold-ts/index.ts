import { MultiAppStaking } from "./mas"
import { IMulticall, Multicall } from "./multicall"
import { IStaking, Staking } from "./staking"
import { ITBTC, TBTC } from "./tbtc"
import { ThresholdConfig } from "./types"
import { IVendingMachines, VendingMachines } from "./vending-machine"
import { isL1Network } from "../networks/utils"

export class Threshold {
  config!: ThresholdConfig
  multicall!: IMulticall | null
  staking!: IStaking | null
  multiAppStaking!: MultiAppStaking | null
  vendingMachines!: IVendingMachines | null
  tbtc!: ITBTC

  constructor(config: ThresholdConfig) {
    this._initialize(config)
  }

  private _initialize = (config: ThresholdConfig) => {
    this.config = config
    const { ethereum, bitcoin } = config

    if (isL1Network(ethereum.chainId)) {
      this.multicall = new Multicall(ethereum)
      this.vendingMachines = new VendingMachines(ethereum)
      this.staking = new Staking(ethereum, this.multicall, this.vendingMachines)
      this.multiAppStaking = new MultiAppStaking(
        this.staking,
        this.multicall,
        ethereum
      )
    } else {
      this.staking = null
      this.multiAppStaking = null
      this.vendingMachines = null
      this.multicall = null
      console.warn(
        `Contracts like VendingMachines, Multicall and Staking are not available on chain ID ${ethereum.chainId}.`
      )
    }
    this.tbtc = new TBTC(ethereum, bitcoin)
  }

  updateConfig = (config: ThresholdConfig) => {
    this._initialize(config)
  }
}
