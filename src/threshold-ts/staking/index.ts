import TokenStaking from "@threshold-network/solidity-contracts/artifacts/TokenStaking.json"
import NuCypherStakingEscrow from "@threshold-network/solidity-contracts/artifacts/NuCypherStakingEscrow.json"
import KeepTokenStaking from "@keep-network/keep-core/artifacts/TokenStaking.json"
import { BigNumber, BigNumberish, Contract, ContractTransaction } from "ethers"
import { ContractCall, IMulticall } from "../multicall"
import { EthereumConfig } from "../types"
import {
  getContract,
  getContractAddressFromTruffleArtifact,
  getContractPastEvents,
  isAddress,
  isSameETHAddress,
  ZERO,
} from "../utils"
import { IVendingMachines } from "../vending-machine"

// Note: Must be in the same order as here:
// https://github.com/threshold-network/solidity-contracts/blob/main/contracts/staking/IStaking.sol#L30-L
// because solidity eg. for `StakeType.NU` returns 0.
export enum StakeType {
  NU,
  KEEP,
  T,
}

export interface Stake<NumberType extends BigNumberish = BigNumber> {
  stakeType?: StakeType
  owner: string
  stakingProvider: string
  beneficiary: string
  authorizer: string
  nuInTStake: NumberType
  keepInTStake: NumberType
  tStake: NumberType
  totalInTStake: NumberType
  possibleKeepTopUpInT: NumberType
  possibleNuTopUpInT: NumberType
}

export interface RolesOf {
  owner: string
  beneficiary: string
  authorizer: string
}

export interface IStaking {
  stakingContract: Contract
  STAKING_CONTRACT_DEPLOYMENT_BLOCK: number
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

  requestAuthorizationDecrease(
    stakingProvider: string,
    application: string,
    amount: BigNumberish
  ): Promise<ContractTransaction>

  /**
   * Gets the stake owner, the beneficiary and the authorizer for the specified
   * staking provider address.
   * @param stakingProvider Staking provider address
   * @returns Object containing owner, beneficiary and authorizer of the given
   * stake. If the staking provider is not used in any stake then it returns
   * zero address for each role.
   */
  rolesOf(stakingProvider: string): Promise<RolesOf>

  /**
   * Returns all stakes for the given owner address.
   * @param owner The stake owner address
   * @returns All stakes for a given owner address.
   */
  getOwnerStakes(owner: string): Promise<Array<Stake>>
}

export class Staking implements IStaking {
  private _staking: Contract
  private _multicall: IMulticall
  private _legacyKeepStaking: Contract
  private _legacyNuStaking: Contract
  private _vendingMachines: IVendingMachines
  public readonly STAKING_CONTRACT_DEPLOYMENT_BLOCK: number

  constructor(
    config: EthereumConfig,
    multicall: IMulticall,
    vendingMachines: IVendingMachines
  ) {
    this.STAKING_CONTRACT_DEPLOYMENT_BLOCK = config.chainId === 1 ? 14113768 : 0
    this._staking = getContract(
      TokenStaking.address,
      TokenStaking.abi,
      config.providerOrSigner,
      config.account
    )
    this._legacyKeepStaking = getContract(
      getContractAddressFromTruffleArtifact(KeepTokenStaking),
      KeepTokenStaking.abi,
      config.providerOrSigner,
      config.account
    )
    this._legacyNuStaking = getContract(
      NuCypherStakingEscrow.address,
      NuCypherStakingEscrow.abi,
      config.providerOrSigner,
      config.account
    )
    this._multicall = multicall
    this._vendingMachines = vendingMachines
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
    stakingProvider: string,
    stakeType?: StakeType
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
      {
        interface: this._legacyKeepStaking.interface,
        address: this._legacyKeepStaking.address,
        method: "eligibleStake",
        args: [stakingProvider, this._staking.address],
      },
    ]

    const [rolesOf, stakes, eligibleKeepStake] =
      await this._multicall.aggregate(multicalls)

    const { owner, authorizer, beneficiary } = rolesOf

    const { tStake, keepInTStake, nuInTStake } = stakes

    // The NU staker can have only one stake.
    const { stakingProvider: nuStakingProvider, value: nuStake } =
      await this._legacyNuStaking.stakerInfo(owner)
    const possibleNuTopUpInT =
      isAddress(nuStakingProvider) &&
      isSameETHAddress(stakingProvider, nuStakingProvider)
        ? BigNumber.from(
            (await this._vendingMachines.nu.convertToT(nuStake.toString()))
              .tAmount
          ).sub(BigNumber.from(nuInTStake))
        : ZERO

    const keepEligableStakeInT = (
      await this._vendingMachines.keep.convertToT(eligibleKeepStake.toString())
    ).tAmount
    const possibleKeepTopUpInT = BigNumber.from(keepEligableStakeInT).sub(
      BigNumber.from(keepInTStake)
    )

    const totalInTStake = tStake.add(keepInTStake).add(nuInTStake)

    return {
      stakeType,
      owner,
      authorizer,
      beneficiary,
      stakingProvider,
      tStake,
      keepInTStake,
      nuInTStake,
      totalInTStake,
      possibleKeepTopUpInT,
      possibleNuTopUpInT,
    }
  }

  requestAuthorizationDecrease = async (
    stakingProvider: string,
    application: string,
    amount: BigNumberish
  ): Promise<ContractTransaction> => {
    return await this._staking[
      "requestAuthorizationDecrease(address,address,uint96)"
    ](stakingProvider, application, amount)
  }

  rolesOf = async (stakingProvider: string): Promise<RolesOf> => {
    const rolesOf = await this._staking.rolesOf(stakingProvider)
    return {
      owner: rolesOf.owner,
      beneficiary: rolesOf.beneficiary,
      authorizer: rolesOf.authorizer,
    }
  }

  getOwnerStakes = async (owner: string): Promise<Array<Stake>> => {
    const stakedEvents = (
      await getContractPastEvents(this._staking, {
        eventName: "Staked",
        fromBlock: this.STAKING_CONTRACT_DEPLOYMENT_BLOCK,
        filterParams: [undefined, owner],
      })
    ).reverse()

    return await Promise.all(
      stakedEvents.map((stakedEvent) =>
        this.getStakeByStakingProvider(
          stakedEvent.args?.stakingProvider,
          stakedEvent.args?.stakeType
        )
      )
    )
  }
}
