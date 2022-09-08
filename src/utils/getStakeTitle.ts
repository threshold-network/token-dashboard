import { StakeData } from "../types"
import { StakeType } from "../enums"

export const getStakeTitle = (stake?: StakeData | null): string => {
  const stakeTitle = "stake"
  const stakeType = !stake
    ? ""
    : stake.stakeType === StakeType.NU || stake.stakeType === StakeType.KEEP
    ? ` - legacy ${StakeType[stake.stakeType]}`
    : " - native"
  return stakeTitle + stakeType
}
