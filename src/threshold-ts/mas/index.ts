import { BigNumber } from "ethers"
import RandomBeacon from "@keep-network/random-beacon/artifacts/RandomBeacon.json"
import WalletRegistry from "@keep-network/ecdsa/artifacts/WalletRegistry.json"
import {
  Application,
  AuthorizationParameters,
  IApplication,
} from "../applications"
import { IMulticall, ContractCall } from "../multicall"
import { IStaking } from "../staking"
import { EthereumConfig } from "../types"

export interface SupportedAppAuthorizationParameters {
  tbtc: AuthorizationParameters
  randomBeacon: AuthorizationParameters
}

export class MultiAppStaking {
  private _staking: IStaking
  private _multicall: IMulticall
  public readonly randomBeacon: IApplication
  public readonly ecdsa: IApplication

  constructor(
    staking: IStaking,
    multicall: IMulticall,
    config: EthereumConfig
  ) {
    this._staking = staking
    this._multicall = multicall
    this.randomBeacon = new Application(this._staking, this._multicall, {
      address: RandomBeacon.address,
      abi: RandomBeacon.abi,
      ...config,
    })
    this.ecdsa = new Application(this._staking, this._multicall, {
      address: WalletRegistry.address,
      abi: WalletRegistry.abi,
      ...config,
    })
  }

  async getSupportedAppsAuthParameters(): Promise<{
    tbtc: BigNumber
    randomBeacon: BigNumber
  }> {
    const calls: ContractCall[] = [
      {
        interface: this.ecdsa.contract.interface,
        address: this.ecdsa.address,
        method: "authorizationParameters",
        args: [],
      },
      {
        interface: this.randomBeacon.contract.interface,
        address: this.randomBeacon.address,
        method: "authorizationParameters",
        args: [],
      },
    ]

    const [tbtcMinAuthorizationParams, randomBeaconMinAuthorizationParams] =
      await this._multicall.aggregate(calls)

    return {
      tbtc: tbtcMinAuthorizationParams,
      randomBeacon: randomBeaconMinAuthorizationParams,
    }
  }
}
