// import { StakeData } from "../types"
import { StakeType } from "../enums"

export const getStakeTitle = (stakeType?: StakeType | null): string => {
  const stakeTitle1 = "stake"
  const stakeTitle2 = !stakeType
    ? ""
    : stakeType === (StakeType.NU as StakeType) ||
      stakeType === (StakeType.KEEP as StakeType)
    ? ` - legacy ${StakeType[stakeType]}`
    : " - native"
  return stakeTitle1 + stakeTitle2
}
