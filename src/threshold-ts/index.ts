import { EthereumBridge } from "@keep-network/tbtc-v2.ts"
import { MultiAppStaking } from "./mas"
import { IMulticall, Multicall } from "./multicall"
import { IStaking, Staking } from "./staking"
import { TBTC } from "./tbtc"
import { ThresholdConfig } from "./types"

export class Threshold {
  multicall!: IMulticall
  staking!: IStaking
  multiAppStaking!: MultiAppStaking
  tbtc!: TBTC

  constructor(config: ThresholdConfig) {
    this._initialize(config)
  }

  private _initialize = (config: ThresholdConfig) => {
    this.multicall = new Multicall(config.ethereum)
    this.staking = new Staking(config.ethereum, this.multicall)
    this.multiAppStaking = new MultiAppStaking(
      this.staking,
      this.multicall,
      config.ethereum
    )
    this.tbtc = new TBTC(config.ethereum)
  }

  updateConfig = (config: ThresholdConfig) => {
    this._initialize(config)
  }
}
