import { BigNumber } from "ethers"
import RandomBeacon from "@keep-network/random-beacon/artifacts/RandomBeacon.json"
import WalletRegistry from "@keep-network/ecdsa/artifacts/WalletRegistry.json"
import { ContractCall } from "../../web3/utils"
import { Application, IApplication } from "../applications"
import { IMulticall } from "../multicall"
import { IStaking } from "../staking"

export interface AuthorizedStakes {
  [stakingProvider: string]: BigNumber
}

export interface PendingAuthorizationDecreaseRequests {
  [stakingProvider: string]: {
    amount: BigNumber
    remainingDelay: BigNumber
  }
}

export class MultiAppStaking {
  private _staking: IStaking
  private _multicall: IMulticall
  public readonly randomBeacon: IApplication
  public readonly ecdsa: IApplication

  constructor(staking: IStaking, multicall: IMulticall) {
    this._staking = staking
    this._multicall = multicall
    this.randomBeacon = new Application(this._staking, {
      address: RandomBeacon.address,
      abi: RandomBeacon.abi,
    })
    this.ecdsa = new Application(this._staking, {
      address: WalletRegistry.address,
      abi: WalletRegistry.abi,
    })
  }

  private async getAuthorizedStakes(
    stakingProviders: string[],
    application: string
  ): Promise<AuthorizedStakes> {
    const multicalls: ContractCall[] = stakingProviders.map(
      (stakingProvider) => ({
        contract: this._staking.stakingContract,
        method: "authorizedStake",
        args: [stakingProvider, application],
      })
    )
    const result: BigNumber[] = await this._multicall.aggregate(multicalls)

    return result.reduce(
      (reducer, authorizedStake, index): AuthorizedStakes => {
        reducer[stakingProviders[index]] = authorizedStake

        return reducer
      },
      {} as AuthorizedStakes
    )
  }

  async getTBTCAuthorizedStakes(
    stakingProviders: string[]
  ): Promise<AuthorizedStakes> {
    return await this.getAuthorizedStakes(stakingProviders, this.ecdsa.address)
  }

  async getRandomBeaconAuthorizedStakes(
    stakingProviders: string[]
  ): Promise<AuthorizedStakes> {
    return await this.getAuthorizedStakes(
      stakingProviders,
      this.randomBeacon.address
    )
  }

  async getMinimumAppAuthorizations(): Promise<{
    tbtc: BigNumber
    randomBeacon: BigNumber
  }> {
    const calls: ContractCall[] = [
      {
        contract: this.ecdsa.contract,
        method: "minimumAuthorization",
        args: [],
      },
      {
        contract: this.randomBeacon.contract,
        method: "minimumAuthorization",
        args: [],
      },
    ]

    const [tbtcMinAuthorization, randomBeaconMinAuthorization] =
      await this._multicall.aggregate(calls)

    return {
      tbtc: tbtcMinAuthorization,
      randomBeacon: randomBeaconMinAuthorization,
    }
  }

  private async getPendingAuthorizationDecreseRequests(
    stakingProviders: string[],
    application: IApplication
  ): Promise<PendingAuthorizationDecreaseRequests> {
    if (stakingProviders.length === 0) return {}

    const decreaseRequestsCalls: ContractCall[] = stakingProviders.map(
      (stakingProvider) => ({
        contract: application.contract,
        method: "pendingAuthorizationDecrease",
        args: [stakingProvider],
      })
    )

    const remainingAuthorizationDecreaseDelayCalls: ContractCall[] =
      stakingProviders.map((stakingProvider) => ({
        contract: application.contract,
        method: "remainingAuthorizationDecreaseDelay",
        args: [stakingProvider],
      }))

    const decreaseRequests = await this._multicall.aggregate(
      decreaseRequestsCalls
    )
    const delays = await this._multicall.aggregate(
      remainingAuthorizationDecreaseDelayCalls
    )

    return stakingProviders.reduce(
      (
        reducer,
        stakingProvider,
        index
      ): PendingAuthorizationDecreaseRequests => {
        const amount = decreaseRequests[index]
        const remainingDelay = delays[index]
        reducer[stakingProvider] = { amount, remainingDelay }
        return reducer
      },
      {} as PendingAuthorizationDecreaseRequests
    )
  }

  async getRandomBeaconPendingAuthorizationDecreseRequests(
    stakingProviders: string[]
  ) {
    return await this.getPendingAuthorizationDecreseRequests(
      stakingProviders,
      this.randomBeacon
    )
  }

  async getTBTCPendingAuthorizationDecreseRequests(stakingProviders: string[]) {
    return await this.getPendingAuthorizationDecreseRequests(
      stakingProviders,
      this.ecdsa
    )
  }
}
