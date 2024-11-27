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
  public readonly randomBeacon: IApplication | null
  public readonly ecdsa: IApplication | null
  public readonly taco: IApplication | null

  constructor(
    staking: IStaking,
    multicall: IMulticall,
    config: EthereumConfig
  ) {
    this._staking = staking
    this._multicall = multicall
    const randomBeaconArtifact = getArtifact(
      "RandomBeacon",
      config.chainId,
      config.shouldUseTestnetDevelopmentContracts
    )
    this.randomBeacon = randomBeaconArtifact
      ? new Application(this._staking, this._multicall, {
          address: randomBeaconArtifact.address,
          abi: randomBeaconArtifact.abi,
          ...config,
        })
      : null
    const walletRegistryArtifacts = getArtifact(
      "WalletRegistry",
      config.chainId,
      config.shouldUseTestnetDevelopmentContracts
    )
    this.ecdsa = walletRegistryArtifacts
      ? new Application(this._staking, this._multicall, {
          address: walletRegistryArtifacts.address,
          abi: walletRegistryArtifacts.abi,
          ...config,
        })
      : null
    const tacoRegistryArtifacts = getArtifact(
      "TacoRegistry",
      config.chainId,
      config.shouldUseTestnetDevelopmentContracts
    )
    this.taco = tacoRegistryArtifacts
      ? new Application(this._staking, this._multicall, {
          address: tacoRegistryArtifacts.address,
          abi: tacoRegistryArtifacts.abi,
          ...config,
        })
      : null
  }

  async getSupportedAppsAuthParameters(): Promise<
    Partial<SupportedAppAuthorizationParameters>
  > {
    const calls: ContractCall[] = []
    const results: Partial<SupportedAppAuthorizationParameters> = {}

    let index = 0

    if (this.ecdsa) {
      calls.push({
        interface: this.ecdsa.contract.interface,
        address: this.ecdsa.address,
        method: "authorizationParameters",
        args: [],
      })
    }

    if (this.randomBeacon) {
      calls.push({
        interface: this.randomBeacon.contract.interface,
        address: this.randomBeacon.address,
        method: "authorizationParameters",
        args: [],
      })
    }

    if (this.taco) {
      calls.push({
        interface: this.taco.contract.interface,
        address: this.taco.address,
        method: "authorizationParameters",
        args: [],
      })
    }

    const callResults = await this._multicall.aggregate(calls)

    if (this.ecdsa) {
      results.tbtc = callResults[index++]
    }

    if (this.randomBeacon) {
      results.randomBeacon = callResults[index++]
    }

    if (this.taco) {
      results.taco = callResults[index++]
    }

    return results
  }

  async getMappedOperatorsForStakingProvider(
    stakingProvider: string
  ): Promise<Partial<MappedOperatorsForStakingProvider>> {
    const calls: ContractCall[] = []
    const results: Partial<MappedOperatorsForStakingProvider> = {}

    let index = 0

    if (this.ecdsa) {
      calls.push({
        interface: this.ecdsa.contract.interface,
        address: this.ecdsa.address,
        method: "stakingProviderToOperator",
        args: [stakingProvider],
      })
    }

    if (this.randomBeacon) {
      calls.push({
        interface: this.randomBeacon.contract.interface,
        address: this.randomBeacon.address,
        method: "stakingProviderToOperator",
        args: [stakingProvider],
      })
    }

    if (this.taco) {
      calls.push({
        interface: this.taco.contract.interface,
        address: this.taco.address,
        method: "stakingProviderToOperator",
        args: [stakingProvider],
      })
    }

    const callResults = await this._multicall.aggregate(calls)

    if (this.ecdsa) {
      results.tbtc = callResults[index++].toString()
    }

    if (this.randomBeacon) {
      results.randomBeacon = callResults[index++].toString()
    }

    if (this.taco) {
      results.taco = callResults[index++].toString()
    }

    return results
  }
}
