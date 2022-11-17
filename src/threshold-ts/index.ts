import { MultiAppStaking } from "./mas"
import { IMulticall, Multicall } from "./multicall"
import { Rewards } from "./rewards"
import { IStaking, Staking } from "./staking"
import { ITokens, Tokens } from "./tokens"
import { ThresholdConfig } from "./types"
import { IVendingMachines, VendingMachines } from "./vending-machine"

export class Threshold {
  multicall!: IMulticall
  staking!: IStaking
  multiAppStaking!: MultiAppStaking
  vendingMachines!: IVendingMachines
  tokens!: ITokens
  rewards!: Rewards

  constructor(config: ThresholdConfig) {
    this._initialize(config)
  }

  private _initialize = (config: ThresholdConfig) => {
    this.multicall = new Multicall(config.ethereum)
    this.tokens = new Tokens(config.ethereum)
    this.vendingMachines = new VendingMachines(config.ethereum)
    this.staking = new Staking(
      config.ethereum,
      this.multicall,
      this.vendingMachines
    )
    this.multiAppStaking = new MultiAppStaking(
      this.staking,
      this.multicall,
      config.ethereum
    )
    this.rewards = new Rewards(
      config.ethereum,
      this.staking,
      this.multiAppStaking.pre
    )
  }

  updateConfig = (config: ThresholdConfig) => {
    this._initialize(config)
  }
}
