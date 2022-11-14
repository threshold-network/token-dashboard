import { Rewards as StakingBonusRewardsType } from "../threshold-ts/rewards/staking-bonus"

export interface RewardsJSONData {
  totalAmount: string
  merkleRoot: string
  claims: {
    [stakingProvider: string]: {
      amount: string
      proof: string[]
      beneficiary: string
    }
  }
}

export interface InterimRewards {
  [stakingProvider: string]: string
}

export type BonusEligibility = StakingBonusRewardsType

export interface StakingBonusRewards {
  [stakingProvider: string]: BonusEligibility
}
