export interface RewardsJSONData {
  tokenTotal: string
  merkleRoot: string
  claims: { [stakingProvider: string]: { amount: string; proof: string[] } }
}

export interface BonusEligibility {
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

export interface InterimRewards {
  [stakingProvider: string]: string
}

export interface StakingBonusRewards {
  [stakingProvider: string]: BonusEligibility
}
