import { providers, Signer, VoidSigner } from "ethers"
import { MultiAppStaking } from "./mas"
import { IMulticall, Multicall } from "./multicall"
import { IStaking, Staking } from "./staking"
import { ITBTC, TBTC } from "./tbtc"
import { MockTBTC } from "./tbtc/mock-tbtc"
import { ThresholdConfig } from "./types"
import { IVendingMachines, VendingMachines } from "./vending-machine"

export class Threshold {
  multicall!: IMulticall
  staking!: IStaking
  multiAppStaking!: MultiAppStaking
  vendingMachines!: IVendingMachines
  tbtc!: ITBTC

  constructor(config: ThresholdConfig) {
    this._initialize(config)
  }

  private _initialize = (config: ThresholdConfig) => {
    this.multicall = new Multicall(config.ethereum)
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
    this._initializeTBTCLib(config.ethereum.providerOrSigner, config.mockTbtc)
  }

  private _initializeTBTCLib = (
    providerOrSigner: providers.Provider | Signer,
    mockTBTC: boolean = false
  ) => {
    let provider = providerOrSigner
    if (provider instanceof providers.Provider) {
      // TODO: use proper address
      provider = new VoidSigner(
        "0x3c5d0B515C993D2E8b5044e3E5cBAE3B08796A01",
        provider
      )
    }

    if (mockTBTC) {
      this.tbtc = new MockTBTC(provider)
    } else {
      this.tbtc = new TBTC(provider)
    }
  }

  updateConfig = (config: ThresholdConfig) => {
    this._initialize(config)
  }
}
