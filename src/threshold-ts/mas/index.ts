import RandomBeacon from "@keep-network/random-beacon/artifacts/RandomBeacon.json"
import WalletRegistry from "@keep-network/ecdsa/artifacts/WalletRegistry.json"
import SimplePREApplicationABI from "../utils/abi/SimplePreApplication.json"

import {
  Application,
  AuthorizationParameters,
  IApplication,
  IPREApplication,
  PREApplication,
} from "../applications"
import { IMulticall, ContractCall } from "../multicall"
import { IStaking } from "../staking"
import { EthereumConfig } from "../types"
import { AddressZero } from "../utils"

export interface SupportedAppAuthorizationParameters {
  tbtc: AuthorizationParameters
  randomBeacon: AuthorizationParameters
}

export interface MappedOperatorsForStakingProvider {
  tbtc: string
  randomBeacon: string
  pre: string
}

export const PRE_ADDRESSESS = {
  1: "0x7E01c9c03FD3737294dbD7630a34845B0F70E5Dd",
  5: "0x829fdCDf6Be747FEA37518fBd83dF70EE371fCf2",
  1337: AddressZero,
} as Record<number | string, string>

export class MultiAppStaking {
  private _staking: IStaking
  private _multicall: IMulticall
  public readonly randomBeacon: IApplication
  public readonly ecdsa: IApplication
  public readonly pre: IPREApplication

  constructor(
    staking: IStaking,
    multicall: IMulticall,
    config: EthereumConfig
  ) {
    const preAddress = PRE_ADDRESSESS[config.chainId]
    if (!preAddress) {
      throw new Error("Unsupported chain id")
    }

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
    this.pre = new PREApplication(this._multicall, {
      address: preAddress,
      abi: SimplePREApplicationABI,
      ...config,
    })
  }

  async getSupportedAppsAuthParameters(): Promise<SupportedAppAuthorizationParameters> {
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

  async getMappedOperatorsForStakingProvider(
    stakingProvider: string
  ): Promise<MappedOperatorsForStakingProvider> {
    const calls: ContractCall[] = [
      {
        interface: this.ecdsa.contract.interface,
        address: this.ecdsa.address,
        method: "stakingProviderToOperator",
        args: [stakingProvider],
      },
      {
        interface: this.randomBeacon.contract.interface,
        address: this.randomBeacon.address,
        method: "stakingProviderToOperator",
        args: [stakingProvider],
      },
      {
        interface: this.pre.contract.interface,
        address: this.pre.address,
        method: "getOperatorFromStakingProvider",
        args: [stakingProvider],
      },
    ]

    const [mappedOperatorTbtc, mappedOperatorRandomBeacon, mappedOperatorPre] =
      await this._multicall.aggregate(calls)

    return {
      tbtc: mappedOperatorTbtc.toString(),
      randomBeacon: mappedOperatorRandomBeacon.toString(),
      pre: mappedOperatorPre.toString(),
    }
  }
}
