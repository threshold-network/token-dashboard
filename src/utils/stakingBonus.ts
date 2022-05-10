import { FixedNumber } from "@ethersproject/bignumber"
import { stakingBonus } from "../constants"

export const calculateStakingBonusReward = (eligibleStakeAmount: string) =>
  FixedNumber.fromString(eligibleStakeAmount)
    .mulUnsafe(FixedNumber.fromString(stakingBonus.STAKING_BONUS_MULTIPLIER))
    .toString()
    // Remove `.` to return an integer.
    .split(".")[0]
