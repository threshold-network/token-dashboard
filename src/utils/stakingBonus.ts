import { FixedNumber } from "@ethersproject/bignumber"
import { stakingBonus as stakingBonusConstants } from "../constants"
import { dateToUnixTimestamp } from "./date"

export const calculateStakingBonusReward = (eligibleStakeAmount: string) =>
  FixedNumber.fromString(eligibleStakeAmount)
    .mulUnsafe(
      FixedNumber.fromString(stakingBonusConstants.STAKING_BONUS_MULTIPLIER)
    )
    .toString()
    // Remove `.` to return an integer.
    .split(".")[0]

export const isBeforeOrEqualBonusDeadline = (date: Date = new Date()) =>
  dateToUnixTimestamp(date) <= stakingBonusConstants.BONUS_DEADLINE_TIMESTAMP
