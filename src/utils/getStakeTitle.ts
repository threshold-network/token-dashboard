import { StakeType } from "../enums"

export const getStakeTitle = (
  stakeType?: StakeType,
  id?: number | string
): string => {
  const stakeTitleMain = "stake"
  const stakeTitleId = id ? ` ${id.toString()}` : ""
  const stakeTitleType = !stakeType
    ? ""
    : stakeType === (StakeType.NU as StakeType) ||
      stakeType === (StakeType.KEEP as StakeType)
    ? ` - legacy ${StakeType[stakeType]}`
    : " - native"
  return stakeTitleMain + stakeTitleId + stakeTitleType
}
