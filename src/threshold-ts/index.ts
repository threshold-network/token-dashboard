import { VendingMachines, IVendingMachines } from "./vending-machine"
import { MultiAppStaking } from "./mas"
import { Staking, IStaking } from "./staking"
import { TBTC, ITBTC } from "./tbtc"
import { Bridge, IBridge } from "./bridge"
import { Multicall, IMulticall } from "./multicall"
import { ThresholdConfig } from "./types"

export class Threshold {
  // @ts-ignore
  config!: ThresholdConfig
  multicall!: IMulticall
  vendingMachines!: IVendingMachines
  staking!: IStaking
  multiAppStaking!: MultiAppStaking
  tbtc!: ITBTC
  bridge!: IBridge

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
    this.bridge = new Bridge(ethereum)
  }

  updateConfig = async (config: ThresholdConfig) => {
    this._initialize(config)
  }
}
