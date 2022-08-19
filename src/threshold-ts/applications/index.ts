import { BigNumber, Contract, ContractInterface } from "ethers"
import { getContract, isAddress, isAddressZero } from "../utils"
import { IStaking } from "../staking"

/**
 * Represents an applciation.
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
   * Calculates reward eligibility for an application.
   * @returns `true` if the staking provider is eligible for rewards, otherwise
   * returns `false`.
   */
  isEligibleForRewards(stakingProvider: string): Promise<boolean>
}

export class Application implements IApplication {
  private _application: Contract
  private _staking: IStaking

  constructor(
    staking: IStaking,
    config: { address: string; abi: ContractInterface }
  ) {
    const { address, abi } = config
    this._application = getContract(address, abi)
    this._staking = staking
  }

  async authorizedStake(stakingProvider: string): Promise<BigNumber> {
    return await this._staking.authorizedStake(
      stakingProvider,
      this._application.address
    )
  }

  async minimumAuthorization(): Promise<BigNumber> {
    return await this._application.minimumAuthorization()
  }

  async pendingAuthorizationDecrease(
    stakingProvider: string
  ): Promise<BigNumber> {
    return await this._application.pendingAuthorizationDecrease(stakingProvider)
  }

  async remainingAuthorizationDecreaseDelay(
    stakingProvider: string
  ): Promise<BigNumber> {
    return await this._application.remainingAuthorizationDecreaseDelay(
      stakingProvider
    )
  }

  async authorizationDecreaseDelay(): Promise<BigNumber> {
    const { authorizationDecreaseDelay } =
      await this._application.authorizationParameters()
    return authorizationDecreaseDelay
  }

  async isEligibleForRewards(stakingProvider: string): Promise<boolean> {
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
