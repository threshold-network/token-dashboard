import { BigNumber, BigNumberish, Contract, ContractInterface } from "ethers"
import { getContract, isAddress, isAddressZero } from "../utils"
import { IStaking } from "../staking"
import { EthereumConfig } from "../types"
import { IMulticall, ContractCall } from "../multicall"

export interface AuthorizationParameters<
  NumberType extends BigNumberish = BigNumber
> {
  /**
   * The minimum authorization amount required so that operator can participate
   * in the random beacon. This amount is required to execute slashing for
   * providing a malicious DKG result or when a relay entry times out.
   */
  minimumAuthorization: NumberType
  /**
   * Delay in seconds that needs to pass between the time authorization decrease
   * is requested and the time that request gets approved. Protects against
   * free-riders earning rewards and not being active in the network.
   */
  authorizationDecreaseDelay: NumberType
  /**
   * Authorization decrease change period in seconds. It is the time, before
   * authorization decrease delay end, during which the pending authorization
   * decrease request can be overwritten. If set to 0, pending authorization
   * decrease request can not be overwritten until the entire
   * `authorizationDecreaseDelay` ends. If set to value equal
   * `authorizationDecreaseDelay`, request can always be overwritten.
   */
  authorizationDecreaseChangePeriod: NumberType
}

export interface StakingProviderAppInfo<
  NumberType extends BigNumberish = BigNumber
> {
  /**
   * Authorized stake amount of the staking provider.
   */
  authorizedStake: NumberType
  /**
   * Amount being deauthorized for the staking provider.
   */
  pendingAuthorizationDecrease: NumberType
  /**
   * Time in seconds until the deauthorization can be completed.
   */
  remainingAuthorizationDecreaseDelay: NumberType
}

/**
 * Represents an application.
 */
export interface IApplication {
  /**
   * Application address.
   */
  address: string

  /**
   * Application contract.
   */
  contract: Contract

  /**
   * Returns the authorized stake amount of the staking provider.
   * @param stakingProvider Staking provider's address.
   * @returns Authorized stake amount of the staking provider.
   */
  authorizedStake(stakingProvider: string): Promise<BigNumber>

  /**
   * Returns the minimum authorization amount required so that staking provider
   * can participate in application operations.
   * @returns Minimum authorization amount.
   */
  minimumAuthorization(): Promise<BigNumber>

  /**
   * Returns the amount being deauthorized for the staking provider.
   * @param stakingProvider Staking provider's address.
   * @returns Amount being deauthorized.
   */
  pendingAuthorizationDecrease(stakingProvider: string): Promise<BigNumber>

  /**
   * Returns the time until the deauthorization can be completed.
   * @param stakingProvider Staking provider's address.
   * @returns Time in seconds until the deauthorization can be completed.
   */
  remainingAuthorizationDecreaseDelay(
    stakingProvider: string
  ): Promise<BigNumber>

  /**
   * Returns authorization decrease delay in seconds between the time
   * authorization decrease is requested and the time the authorization decrease
   * can be approved. It is always the same value, no matter if authorization
   * decrease amount is small, significant, or if it is a decrease to zero.
   * @returns Authorization decrease delay in seconds
   */
  authorizationDecreaseDelay(): Promise<BigNumber>

  /**
   * Returns authorization-related parameters.
   * @returns Authorization-related parameters such as: minimum authorization
   * amount, authorization decrease delay in seconds and authorization decrease
   * change period in seconds. @see {@link AuthorizationParameters}
   */
  authorizationParameters(): Promise<AuthorizationParameters>
  /**
   * Calculates reward eligibility for an application.
   * @returns `true` if the staking provider is eligible for rewards, otherwise
   * returns `false`.
   */
  isEligibleForRewards(stakingProvider: string): Promise<boolean>

  /**
   * Returns the application data for a given staking provider. This function
   * uses the multicall interface to aggregate contract calls into a single one.
   * @returns Currently authorized amount, amount being deauthorized for the
   * staking provider and the time until the deauthorization can be completed.
   * @see {@link StakingProviderAppInfo}
   */
  getStakingProviderAppInfo(
    stakingProvider: string
  ): Promise<StakingProviderAppInfo>
}

export class Application implements IApplication {
  private _application: Contract
  private _staking: IStaking
  private _multicall: IMulticall

  constructor(
    staking: IStaking,
    multicall: IMulticall,
    config: EthereumConfig & { address: string; abi: ContractInterface }
  ) {
    const { address, abi, providerOrSigner, account } = config
    this._application = getContract(address, abi, providerOrSigner, account)
    this._staking = staking
    this._multicall = multicall
  }

  authorizedStake = async (stakingProvider: string): Promise<BigNumber> => {
    return await this._staking.authorizedStake(
      stakingProvider,
      this._application.address
    )
  }

  minimumAuthorization = async (): Promise<BigNumber> => {
    return await this._application.minimumAuthorization()
  }

  pendingAuthorizationDecrease = async (
    stakingProvider: string
  ): Promise<BigNumber> => {
    return await this._application.pendingAuthorizationDecrease(stakingProvider)
  }

  remainingAuthorizationDecreaseDelay = async (
    stakingProvider: string
  ): Promise<BigNumber> => {
    return await this._application.remainingAuthorizationDecreaseDelay(
      stakingProvider
    )
  }

  authorizationDecreaseDelay = async (): Promise<BigNumber> => {
    const { authorizationDecreaseDelay } =
      await this._application.authorizationParameters()
    return authorizationDecreaseDelay
  }

  authorizationParameters = async (): Promise<any> => {
    const {
      minimumAuthorization,
      authorizationDecreaseDelay,
      authorizationDecreaseChangePeriod,
    } = await this._application.authorizationParameters()

    return {
      minimumAuthorization,
      authorizationDecreaseDelay,
      authorizationDecreaseChangePeriod,
    }
  }

  getStakingProviderAppInfo = async (stakingProvider: string): Promise<any> => {
    const calls: ContractCall[] = [
      {
        interface: this._staking.stakingContract.interface,
        address: this._staking.stakingContract.address,
        method: "authorizedStake",
        args: [stakingProvider, this.address],
      },
      {
        interface: this.contract.interface,
        address: this.contract.address,
        method: "pendingAuthorizationDecrease",
        args: [stakingProvider],
      },
      {
        interface: this.contract.interface,
        address: this.contract.address,
        method: "remainingAuthorizationDecreaseDelay",
        args: [stakingProvider],
      },
    ]

    const [
      authorizedStake,
      pendingAuthorizationDecrease,
      remainingAuthorizationDecreaseDelay,
    ] = await this._multicall.aggregate(calls)

    return {
      authorizedStake,
      pendingAuthorizationDecrease,
      remainingAuthorizationDecreaseDelay,
    }
  }

  isEligibleForRewards = async (stakingProvider: string): Promise<boolean> => {
    const operator = await this._application.stakingProviderToOperator(
      stakingProvider
    )

    if (isAddress(operator) && isAddressZero(operator)) {
      return false
    }

    const isInPool: boolean = await this._application.isOperatorInPool(operator)

    return isInPool
  }

  get address() {
    return this._application.address
  }
  get contract() {
    return this._application
  }
}
