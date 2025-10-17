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
    this.bridge = new Bridge(ethereum)
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
