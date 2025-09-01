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
  private _listeners: (() => void)[] = []

  constructor(config: ThresholdConfig) {
    this._initialize(config)
  }

  subscribe = (listener: () => void) => {
    this._listeners.push(listener)
    return () => {
      this._listeners = this._listeners.filter((l) => l !== listener)
    }
  }

  private _notify = () => {
    this._listeners.forEach((l) => l())
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
    this.tbtc = new TBTC(ethereum, bitcoin, crossChain, this._notify)
  }

  updateConfig = async (config: ThresholdConfig) => {
    this._initialize(config)

    const awaitTbtcReady = new Promise<void>((resolve) => {
      const checkTbtc = () => {
        if (this.tbtc.isTbtcReady) {
          resolve()
        } else {
          setTimeout(checkTbtc, 100)
        }
      }
      checkTbtc()
    })

    await awaitTbtcReady
    this._notify()
  }
}
