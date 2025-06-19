import {
  BigNumber,
  BigNumberish,
  Contract,
  ContractTransaction,
  constants,
} from "ethers"
import { ContractCall, IMulticall } from "../multicall"
import { EthereumConfig } from "../types"
import {
  ADRESS_ZERO,
  EMPTY_STAKE,
  getArtifact,
  getContract,
  getContractPastEvents,
  isEthereumAddress,
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
  stakingContract: Contract | null
  legacyNuStakingContract: Contract | null
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
   * @param amount Amount to authorize.
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
   * Returns the current and outdated staking providers for a given owner
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
  private _staking: Contract | null
  private _multicall: IMulticall
  private _legacyKeepStaking: Contract | null
  private _legacyNuStaking: Contract | null
  private _vendingMachines: IVendingMachines
  public readonly STAKING_CONTRACT_DEPLOYMENT_BLOCK: number

  constructor(
    config: EthereumConfig,
    multicall: IMulticall,
    vendingMachines: IVendingMachines
  ) {
    this.STAKING_CONTRACT_DEPLOYMENT_BLOCK =
      config.chainId === 1 ? 14113768 : 4320502

    const stakingArtifact = getArtifact(
      "TokenStaking",
      config.chainId,
      config.shouldUseTestnetDevelopmentContracts
    )
    this._staking = stakingArtifact
      ? getContract(
          stakingArtifact.address,
          stakingArtifact.abi,
          config.ethereumProviderOrSigner,
          config.account
        )
      : null
    const legacyKeepStakingArtifact = getArtifact(
      "LegacyKeepStaking",
      config.chainId,
      config.shouldUseTestnetDevelopmentContracts
    )
    this._legacyKeepStaking = legacyKeepStakingArtifact
      ? getContract(
          legacyKeepStakingArtifact.address,
          legacyKeepStakingArtifact.abi,
          config.ethereumProviderOrSigner,
          config.account
        )
      : null
    const nuCypherStakingEscrowArtifact = getArtifact(
      "NuCypherStakingEscrow",
      config.chainId,
      config.shouldUseTestnetDevelopmentContracts
    )
    this._legacyNuStaking = nuCypherStakingEscrowArtifact
      ? getContract(
          nuCypherStakingEscrowArtifact.address,
          nuCypherStakingEscrowArtifact.abi,
          config.ethereumProviderOrSigner,
          config.account
        )
      : null
    this._multicall = multicall
    this._vendingMachines = vendingMachines
  }

  async authorizedStake(
    stakingProvider: string,
    application: string
  ): Promise<BigNumber> {
    if (!this._staking) {
      throw new Error(
        "Staking contract is not available on the current network"
      )
    }
    return this._staking.authorizedStake(stakingProvider, application)
  }

  get stakingContract() {
    return this._staking
  }

  get legacyNuStakingContract() {
    return this._legacyNuStaking
  }

  increaseAuthorization = async (
    stakingProvider: string,
    application: string,
    amount: BigNumberish
  ): Promise<ContractTransaction> => {
    if (!this._staking) {
      throw new Error(
        "Staking contract is not available on the current network"
      )
    }
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
    const multicalls: ContractCall[] = []

    if (!this._staking) return EMPTY_STAKE

    multicalls.push(
      ...[
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
    )

    // Only add the eligibleStake call if _legacyKeepStaking is available
    if (this._legacyKeepStaking) {
      multicalls.push({
        interface: this._legacyKeepStaking.interface,
        address: this._legacyKeepStaking.address,
        method: "eligibleStake",
        args: [stakingProvider, this._staking.address],
      })
    }

    const results = await this._multicall.aggregate(multicalls)

    const rolesOf = results[0]
    const stakes = results[1]
    const eligibleKeepStakeResult = this._legacyKeepStaking
      ? results[2]
      : { balance: ZERO }

    const { owner, authorizer, beneficiary } = rolesOf

    const { tStake, keepInTStake, nuInTStake } = stakes

    const eligibleKeepStake = eligibleKeepStakeResult.balance || ZERO

    let nuStakingProvider = ADRESS_ZERO
    let nuStake = ZERO

    if (this._legacyNuStaking) {
      const { stakingProvider: nuProvider, value: nuValue } =
        await this._legacyNuStaking.stakerInfo(owner)
      nuStakingProvider = nuProvider
      nuStake = nuValue
    }

    const isNuStakingProviderValid =
      isEthereumAddress(nuStakingProvider) &&
      isSameETHAddress(stakingProvider, nuStakingProvider)

    const possibleNuTopUpInT = isNuStakingProviderValid
      ? BigNumber.from(
          (await this._vendingMachines.nu.convertToT(nuStake.toString()))
            .tAmount
        ).sub(BigNumber.from(nuInTStake.toString()))
      : ZERO

    const keepEligibleStakeInT = (
      await this._vendingMachines.keep.convertToT(eligibleKeepStake.toString())
    ).tAmount
    const possibleKeepTopUpInT = BigNumber.from(keepEligibleStakeInT).sub(
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
    if (!this._staking) {
      throw new Error(
        "Staking contract is not available on the current network"
      )
    }
    return await this._staking[
      "requestAuthorizationDecrease(address,address,uint96)"
    ](stakingProvider, application, amount)
  }

  rolesOf = async (stakingProvider: string): Promise<RolesOf> => {
    if (!this._staking) {
      return {
        owner: ADRESS_ZERO,
        beneficiary: ADRESS_ZERO,
        authorizer: ADRESS_ZERO,
      }
    }
    const rolesOf = await this._staking.rolesOf(stakingProvider)
    return {
      owner: rolesOf.owner,
      beneficiary: rolesOf.beneficiary,
      authorizer: rolesOf.authorizer,
    }
  }

  getOwnerStakes = async (owner: string): Promise<Array<Stake>> => {
    if (!this._staking) {
      return []
    }

    const stakesEvents = await getContractPastEvents(this._staking, {
      eventName: "Staked",
      fromBlock: this.STAKING_CONTRACT_DEPLOYMENT_BLOCK,
      filterParams: [undefined, owner],
    })

    const stakes = stakesEvents
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
    if (!this._staking) {
      return { current: [], outdated: [] }
    }

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

    if (possibleStakingProviders.length === 0) {
      return { current: [], outdated: [] }
    }

    const multicalls: ContractCall[] = possibleStakingProviders.map(
      (stakingProvider) => ({
        address: this._staking!.address,
        interface: this._staking!.interface,
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
    const rolesOfResults: RolesOf[] = await this._multicall.aggregate(
      multicalls
    )

    // The current staking providers for a given `owner` address.
    const stakingProviders: string[] = rolesOfResults
      .map((rolesOf, index) => ({
        ...rolesOf,
        stakingProvider: possibleStakingProviders[index],
      }))
      .filter((rolesOf) => isSameETHAddress(rolesOf.owner, owner))
      .map((_) => _.stakingProvider)

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
