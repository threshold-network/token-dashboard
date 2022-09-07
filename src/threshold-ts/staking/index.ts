import TokenStaking from "@threshold-network/solidity-contracts/artifacts/TokenStaking.json"
import { BigNumber, BigNumberish, Contract, ContractTransaction } from "ethers"
import { EthereumConfig } from "../types"
import { getContract } from "../utils"

export interface IStaking {
  stakingContract: Contract
  /**
   * Returns the authorized stake amount of the staking provider for the application.
   * @param stakingProvider Staking provider address.
   * @param application Application address.
   * @returns Authorized stake amount.
   */
  authorizedStake(
    stakingProvider: string,
    application: string
  ): Promise<BigNumber>
  /**
   * Increases the authorization of the given staking provider for the given
   * application by the given amount. Can only be called by the given staking
   * provider’s authorizer.
   * @param stakingProvider Staking provider address.
   * @param application Application address.
   * @param amount Amount to authrozie.
   * @returns Ethers `ContractTransaction` instance.
   */
  increaseAuthorization(
    stakingProvider: string,
    application: string,
    amount: BigNumberish
  ): Promise<ContractTransaction>
  // TODO: move other functions here eg fetching all owner stakes.
}

export class Staking implements IStaking {
  private _staking: Contract

  constructor(config: EthereumConfig) {
    this._staking = getContract(
      TokenStaking.address,
      TokenStaking.abi,
      config.providerOrSigner,
      config.account
    )
  }

  async authorizedStake(
    stakingProvider: string,
    application: string
  ): Promise<BigNumber> {
    return this._staking.authorizedStake(stakingProvider, application)
  }

  get stakingContract() {
    return this._staking
  }

  increaseAuthorization = async (
    stakingProvider: string,
    application: string,
    amount: BigNumberish
  ): Promise<ContractTransaction> => {
    return await this._staking.increaseAuthorization(
      stakingProvider,
      application,
      amount
    )
  }
}
