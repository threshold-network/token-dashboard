import { MultiAppStaking } from "./mas"
import { IMulticall, Multicall } from "./multicall"
import { IStaking, Staking } from "./staking"
import { ThresholdConfig } from "./types"

export class Threshold {
  multicall: IMulticall
  staking: IStaking
  multiAppStaking: MultiAppStaking

  constructor(config: ThresholdConfig) {
    this.multicall = new Multicall(config.ethereum)
    this.staking = new Staking(config.ethereum)
    this.multiAppStaking = new MultiAppStaking(
      this.staking,
      this.multicall,
      config.ethereum
    )
  }
}
