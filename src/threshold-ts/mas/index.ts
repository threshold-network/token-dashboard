import RandomBeacon from "@keep-network/random-beacon/artifacts/RandomBeacon.json"
import {
  Application,
  AuthorizationParameters,
  IApplication,
} from "../applications"
import { IMulticall, ContractCall } from "../multicall"
import { IStaking } from "../staking"
import { EthereumConfig } from "../types"
import { getArtifact } from "../utils"

export interface SupportedAppAuthorizationParameters {
  tbtc: AuthorizationParameters
  randomBeacon: AuthorizationParameters
  taco: AuthorizationParameters
}

export interface MappedOperatorsForStakingProvider {
  tbtc: string
  randomBeacon: string
  taco: string
}

export class MultiAppStaking {
  private _staking: IStaking
  private _multicall: IMulticall
  public readonly randomBeacon: IApplication
  public readonly ecdsa: IApplication
  public readonly taco: IApplication

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
    const walletRegistryArtifacts = getArtifact(
      "WalletRegistry",
      config.chainId,
      config.shouldUseTestnetDevelopmentContracts
    )
    this.ecdsa = new Application(this._staking, this._multicall, {
      address: walletRegistryArtifacts.address,
      abi: walletRegistryArtifacts.abi,
      ...config,
    })
    this.taco = new Application(this._staking, this._multicall, {
      address: WalletRegistry.address, // TODO
      abi: WalletRegistry.abi, // TODO
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
      {
        interface: this.taco.contract.interface,
        address: this.taco.address,
        method: "authorizationParameters",
        args: [],
      },
    ]

    const [
      tbtcMinAuthorizationParams,
      randomBeaconMinAuthorizationParams,
      tacoMinAuthorizationParams,
    ] = await this._multicall.aggregate(calls)

    return {
      tbtc: tbtcMinAuthorizationParams,
      randomBeacon: randomBeaconMinAuthorizationParams,
      taco: tacoMinAuthorizationParams,
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
        interface: this.taco.contract.interface,
        address: this.taco.address,
        method: "stakingProviderToOperator",
        args: [stakingProvider],
      },
    ]

    const [mappedOperatorTbtc, mappedOperatorRandomBeacon, mappedOperatorTaco] =
      await this._multicall.aggregate(calls)

    return {
      tbtc: mappedOperatorTbtc.toString(),
      randomBeacon: mappedOperatorRandomBeacon.toString(),
      taco: mappedOperatorTaco.toString(),
    }
  }
}
