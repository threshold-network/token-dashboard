import { Rewards as StakingBonusRewardsType } from "../threshold-ts/rewards/staking-bonus"
import {
  RewardsJSONData as ThresholdRewardsJSONData,
  Rewards as InterimStakingRewardsType,
} from "../threshold-ts/rewards/interim"

export type RewardsJSONData = ThresholdRewardsJSONData

export interface InterimRewards {
  [stakingProvider: string]: InterimStakingRewardsType
}

export type BonusEligibility = StakingBonusRewardsType

export interface StakingBonusRewards {
  [stakingProvider: string]: BonusEligibility
}
