import { StakeData } from "../types"
import { StakeType } from "../enums"

export const generateStakeName = (stake?: StakeData): string => {
  return !stake
    ? ""
    : stake.stakeType === StakeType.NU || stake.stakeType === StakeType.KEEP
    ? ` - legacy ${StakeType[stake.stakeType]}`
    : " - native"
}
