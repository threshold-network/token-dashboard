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

interface OwnerRefreshedResult {
  current: string[]
  outdated: string[]
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
   * @param owner The stake owner address.
   * @returns All stakes for a given owner address.
   */
  getOwnerStakes(owner: string): Promise<Array<Stake>>

  /**
   * Returns the current and outdated staking providers for a givne owner
   * address. The outdated array is necessary while fetching all owner stakes.
   * We need to filter out outdated staking providers eg. the `Staked` event was
   * emitted with the owner address that we are looking for but then the owner
   * was changed(`OwnerRefreshed` event emitted with `oldOwner = owner`) meaning the
   * owner is not the owner of this staking- we should skip that address.
   * @param owner The stake owner address.
   * @returns Two arrays: current and outdated staking providers.
   */
  findRefreshedKeepStakes(owner: string): Promise<OwnerRefreshedResult>
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

    const [rolesOf, stakes, { balance: eligibleKeepStake }] =
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
          ).sub(BigNumber.from(nuInTStake.toString()))
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
    const stakes = (
      await getContractPastEvents(this._staking, {
        eventName: "Staked",
        fromBlock: this.STAKING_CONTRACT_DEPLOYMENT_BLOCK,
        filterParams: [undefined, owner],
      })
    )
      .map((event) => ({
        stakingProvider: event.args?.stakingProvider,
        stakeType: event.args?.stakeType,
      }))
      .reverse()

    const { current, outdated } = await this.findRefreshedKeepStakes(owner)

    const stakingProviders = stakes
      .filter(({ stakingProvider }) => !outdated.includes(stakingProvider))
      .concat(
        current.map((stakingProvider) => ({
          stakingProvider,
          stakeType: StakeType.KEEP,
        }))
      )

    return await Promise.all(
      stakingProviders.map(({ stakingProvider, stakeType }) =>
        this.getStakeByStakingProvider(stakingProvider, stakeType)
      )
    )
  }

  findRefreshedKeepStakes = async (
    owner: string
  ): Promise<OwnerRefreshedResult> => {
    // Find all events where the `owner` was set as a new owner or old owner of
    // the stake.
    const ownerRefreshedEventsFilteredByNewOwner = await getContractPastEvents(
      this._staking,
      {
        eventName: "OwnerRefreshed",
        filterParams: [null, null, owner],
        fromBlock: this.STAKING_CONTRACT_DEPLOYMENT_BLOCK,
      }
    )

    const ownerRefreshedEventsFilteredByOldOwner = await getContractPastEvents(
      this._staking,
      {
        eventName: "OwnerRefreshed",
        filterParams: [null, owner, null],
        fromBlock: this.STAKING_CONTRACT_DEPLOYMENT_BLOCK,
      }
    )

    const ownerRefreshedEvents = [
      ...ownerRefreshedEventsFilteredByNewOwner,
      ...ownerRefreshedEventsFilteredByOldOwner,
    ].sort((a, b) => a.blockNumber - b.blockNumber)

    // Convert to `Set` to remove duplicated staking provider addresses(the
    // owner can be changed multiple times for the same staking provider) and
    // then to an array so we can use `map`, `filter` and other array methods.
    const possibleStakingProviders: string[] = Array.from(
      new Set(ownerRefreshedEvents.map((event) => event?.args?.stakingProvider))
    )

    const multicalls: ContractCall[] = possibleStakingProviders.map(
      (stakingProvider) => ({
        address: this._staking.address,
        interface: this._staking.interface,
        method: "rolesOf",
        args: [stakingProvider],
      })
    )

    // For each staking provider, we need to verify that the current owner of
    // the stake is indeed the one we are looking for (the `owner` argument).
    // It's possible that the owner can be changed multiple times. Instead of
    // iterating through the `OwnerRefreshed` events and comparing the
    // `oldOwner` and `newOwner` params from that event, we can just check the
    // current owner for a given staking provider by calling `rolesOf`.
    const rolesOf = await this._multicall.aggregate(multicalls)

    // The current staking providers for a given `owner` address.
    const stakingProviders: string[] = rolesOf
      .filter((rolesOf) => isSameETHAddress(rolesOf.owner, owner))
      .map((_, index) => possibleStakingProviders[index])

    // Outdated staking providers - the `owner` address is no longer an owner of
    // these stakes.
    const outdatedStakingProviders: string[] = possibleStakingProviders.filter(
      (stakingProvider) => !stakingProviders.includes(stakingProvider)
    )

    return {
      current: stakingProviders,
      outdated: outdatedStakingProviders,
    }
  }
}
