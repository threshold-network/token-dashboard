import { StakeData } from "../types"
import { StakeType } from "../enums"

export const getStakeType = (stake?: StakeData | null): string => {
  return !stake
    ? ""
    : stake.stakeType === StakeType.NU || stake.stakeType === StakeType.KEEP
    ? ` - legacy ${StakeType[stake.stakeType]}`
    : " - native"
}
