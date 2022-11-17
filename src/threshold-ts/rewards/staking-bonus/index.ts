import { BigNumber, BigNumberish, Event, FixedNumber } from "ethers"
import { IRewards } from ".."
import { IPRE } from "../../applications/pre"
import { IStaking } from "../../staking"
import {
  getAddress,
  getContractPastEvents,
  ZERO,
  dateToUnixTimestamp,
} from "../../utils"
import { MerkleDropContract } from "../merkle-drop-contract"

export interface Rewards {
  hasPREConfigured: boolean
  hasActiveStake: boolean
  // No unstaking after the bonus deadline and until mid-July (not even partial
  // amounts).
  hasUnstakeAfterBonusDeadline: boolean
  // Only total staked amount before bonus deadline is taking
  // into account.
  eligibleStakeAmount: string
  reward: string
  isRewardClaimed: boolean
  isEligible: boolean
}

interface StakingProviderData<DataType> {
  [stkingProvider: string]: DataType
}

type StakingProviderToDataToAmount<AdditionalDataType = {}> =
  StakingProviderData<{ amount: BigNumberish } & AdditionalDataType>

type StakingProviderToUnstake = StakingProviderToDataToAmount<{
  hasUnstakeAfterBonusDeadline: boolean
}>

type StakingProviderToStakedInfo = StakingProviderToDataToAmount<{
  stakedAtBlock: number
  transactionHash: string
}>

type StakingProviderToPREConfig = StakingProviderData<{
  operator: string
  operatorConfirmedAtBlock: number
  transactionHash: string
}>

type StakingProviderToTopUps = StakingProviderToDataToAmount

export class StakingBonusRewards implements IRewards<Rewards> {
  static STAKING_BONUS_MULTIPLIER = "0.03" // 3%
  static BONUS_DEADLINE_TIMESTAMP = 1654041599 // May 31 2022 23:59:59 GMT
  static REWARDS_DISTRIBUTION_TIMESTAMP = 1657843200 // July 15 2022 00:00:00 GMT
  static BONUS_DEADLINE_BLOCK_NUMBER = 14881676 // https:etherscan.io/block/14881676

  private _merkleDropContract: MerkleDropContract
  private _pre: IPRE
  private _staking: IStaking

  constructor(
    merkleDropContract: MerkleDropContract,
    staking: IStaking,
    pre: IPRE
  ) {
    this._merkleDropContract = merkleDropContract
    this._staking = staking
    this._pre = pre
  }

  static calculateStakingBonusReward = (eligibleStakeAmount: string) =>
    FixedNumber.fromString(eligibleStakeAmount)
      .mulUnsafe(FixedNumber.fromString(this.STAKING_BONUS_MULTIPLIER))
      .toString()
      // Remove `.` to return an integer.
      .split(".")[0]

  static isBeforeOrEqualBonusDeadline = (date: Date = new Date()) =>
    dateToUnixTimestamp(date) <= this.BONUS_DEADLINE_TIMESTAMP

  static isBetweenBonusDealineAndBonusDistribution = (
    date: Date = new Date()
  ) => {
    const timestamp = dateToUnixTimestamp(date)

    return (
      timestamp > this.BONUS_DEADLINE_TIMESTAMP &&
      timestamp < this.REWARDS_DISTRIBUTION_TIMESTAMP
    )
  }

  calculateRewards = async (
    stakingProviders: string[]
  ): Promise<{ [stakingProvider: string]: Rewards }> => {
    const claimedRewards = new Set(
      (
        await getContractPastEvents(this._merkleDropContract.instance, {
          eventName: "Claimed",
          fromBlock: this._merkleDropContract.deploymentBlock,
          filterParams: [stakingProviders],
        })
      ).map((_) => getAddress(_.args?.stakingProvider as string))
    )

    const operatorConfirmedEvents = await this._pre.getOperatorConfirmedEvents(
      stakingProviders
    )
    const stakedEvents = await this._staking.getStakedEvents(stakingProviders)
    const toppedUpEvents = await this._staking.getToppedUpEvents(
      stakingProviders
    )
    const unstakedEvents = await this._staking.getUnstakedEvents(
      stakingProviders
    )

    const stakingProviderToPREConfig = this._getStakingProviderToPREConfig(
      operatorConfirmedEvents
    )

    const stakingProviderToStakedAmount =
      this._getStakingProviderToStakedInfo(stakedEvents)

    const stakingProviderToTopUps =
      this._getStakingProviderToTopUps(toppedUpEvents)

    const stakingProviderToUnstakedEvent =
      this._getStakingProviderToUnstake(unstakedEvents)

    const stakingProvidersInfo: { [stakingProvider: string]: Rewards } = {}
    for (const stakingProvider of stakingProviders) {
      const stakingProviderAddress = getAddress(stakingProvider)

      const hasPREConfigured =
        stakingProviderToPREConfig[stakingProviderAddress]
          ?.operatorConfirmedAtBlock <=
        StakingBonusRewards.BONUS_DEADLINE_BLOCK_NUMBER

      const hasActiveStake =
        stakingProviderToStakedAmount[stakingProviderAddress]?.stakedAtBlock <=
        StakingBonusRewards.BONUS_DEADLINE_BLOCK_NUMBER

      const hasUnstakeAfterBonusDeadline =
        stakingProviderToUnstakedEvent[stakingProviderAddress]
          ?.hasUnstakeAfterBonusDeadline

      const stakedAmount =
        stakingProviderToStakedAmount[stakingProviderAddress]?.amount || "0"
      const topUpAmount =
        stakingProviderToTopUps[stakingProviderAddress]?.amount || "0"
      const unstakeAmount =
        stakingProviderToUnstakedEvent[stakingProviderAddress]?.amount || "0"

      const eligibleStakeAmount =
        !hasUnstakeAfterBonusDeadline && hasActiveStake
          ? BigNumber.from(stakedAmount)
              .add(topUpAmount)
              .sub(unstakeAmount)
              .toString()
          : "0"

      stakingProvidersInfo[stakingProviderAddress] = {
        hasPREConfigured,
        hasActiveStake,
        hasUnstakeAfterBonusDeadline,
        eligibleStakeAmount,
        reward:
          StakingBonusRewards.calculateStakingBonusReward(eligibleStakeAmount),
        isRewardClaimed: claimedRewards.has(stakingProviderAddress),
        isEligible: Boolean(
          hasActiveStake && !hasUnstakeAfterBonusDeadline && hasPREConfigured
        ),
      }
    }

    return stakingProvidersInfo
  }

  private _getStakingProviderToStakedInfo = (
    events: Event[]
  ): StakingProviderToStakedInfo => {
    const stakingProviderToStakedAmount: StakingProviderToStakedInfo = {}

    for (const stakedEvent of events) {
      const stakingProvider = getAddress(stakedEvent.args?.stakingProvider)

      stakingProviderToStakedAmount[stakingProvider] = {
        amount: stakedEvent.args?.amount as BigNumberish,
        stakedAtBlock: stakedEvent.blockNumber,
        transactionHash: stakedEvent.transactionHash,
      }
    }
    return stakingProviderToStakedAmount
  }

  private _getStakingProviderToPREConfig = (
    events: Event[]
  ): StakingProviderToPREConfig => {
    const stakingProviderToPREConfig: StakingProviderToPREConfig = {}
    for (const event of events) {
      const stakingProvider = getAddress(event.args?.stakingProvider)

      stakingProviderToPREConfig[stakingProvider] = {
        operator: event.args?.operator,
        operatorConfirmedAtBlock: event.blockNumber,
        transactionHash: event.transactionHash,
      }
    }

    return stakingProviderToPREConfig
  }

  private _getStakingProviderToTopUps = (
    events: Event[]
  ): StakingProviderToTopUps => {
    const stakingProviderToAmount: StakingProviderToTopUps = {}
    for (const event of events) {
      const stakingProvider = getAddress(event.args?.stakingProvider)
      const accummulatedAmount =
        stakingProviderToAmount[stakingProvider]?.amount || ZERO

      if (event.blockNumber > StakingBonusRewards.BONUS_DEADLINE_BLOCK_NUMBER) {
        // Break the loop if an event is emitted after the bonus deadline.
        // Returned events are in ascending order.
        return stakingProviderToAmount
      }
      stakingProviderToAmount[stakingProvider] = {
        amount: BigNumber.from(accummulatedAmount).add(event.args?.amount),
      }
    }

    return stakingProviderToAmount
  }

  private _getStakingProviderToUnstake = (
    events: Event[]
  ): StakingProviderToUnstake => {
    const stakingProviderToUnstake: StakingProviderToUnstake = {}
    for (const event of events) {
      const stakingProvider = getAddress(event.args?.stakingProvider)
      const stakingProviderInfo = stakingProviderToUnstake[stakingProvider]
      if (stakingProviderInfo?.hasUnstakeAfterBonusDeadline) {
        // If at least one `Unstaked` event occurred after bonus deadline, this
        // provider is not eligible for bonus so we can skip it from further
        // calculations.
        continue
      }
      const accummulatedAmount =
        stakingProviderToUnstake[stakingProvider]?.amount || ZERO
      const newAmount = BigNumber.from(accummulatedAmount).add(
        event.args?.amount
      )
      if (event.blockNumber > StakingBonusRewards.BONUS_DEADLINE_BLOCK_NUMBER) {
        stakingProviderToUnstake[stakingProvider] = {
          amount: newAmount,
          hasUnstakeAfterBonusDeadline: true,
        }
      } else {
        stakingProviderToUnstake[stakingProvider] = {
          amount: newAmount,
          hasUnstakeAfterBonusDeadline: false,
        }
      }
    }

    return stakingProviderToUnstake
  }
}
