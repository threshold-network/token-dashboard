import TokenStaking from "@threshold-network/solidity-contracts/artifacts/TokenStaking.json"
import { BigNumber, BigNumberish, Contract, ContractTransaction } from "ethers"
import { ContractCall, IMulticall } from "../multicall"
import { EthereumConfig } from "../types"
import { getContract } from "../utils"

export interface Stake<NumberType extends BigNumberish = BigNumber> {
  owner: string
  stakingProvider: string
  beneficiary: string
  authorizer: string
  nuInTStake: NumberType
  keepInTStake: NumberType
  tStake: NumberType
  totalInTStake: NumberType
  // TODO: add `possibleKeepTopUpInT` and `possibleNuTopUpInT`.
}

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
  /**
   * Returns the stake data by given staking provider address.
   * @param stakingProvider Staking provider address.
   * @returns Stake data.
   */
  getStakeByStakingProvider(stakingProvider: string): Promise<Stake>
  // TODO: move other functions here eg fetching all owner stakes.
}

export class Staking implements IStaking {
  private _staking: Contract
  private _multicall: IMulticall

  constructor(config: EthereumConfig, multicall: IMulticall) {
    this._staking = getContract(
      TokenStaking.address,
      TokenStaking.abi,
      config.providerOrSigner,
      config.account
    )
    this._multicall = multicall
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

  getStakeByStakingProvider = async (
    stakingProvider: string
  ): Promise<Stake> => {
    const multicalls: ContractCall[] = [
      {
        interface: this._staking.interface,
        address: this._staking.address,
        method: "rolesOf",
        args: [stakingProvider],
      },
      {
        interface: this._staking.interface,
        address: this._staking.address,
        method: "stakes",
        args: [stakingProvider],
      },
    ]

    const [rolesOf, stakes] = await this._multicall.aggregate(multicalls)

    const { owner, authorizer, beneficiary } = rolesOf

    const { tStake, keepInTStake, nuInTStake } = stakes
    const totalInTStake = tStake.add(keepInTStake).add(nuInTStake)

    return {
      owner,
      authorizer,
      beneficiary,
      stakingProvider,
      tStake,
      keepInTStake,
      nuInTStake,
      totalInTStake,
    }
  }
}
