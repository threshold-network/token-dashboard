import { FC } from "react"
import { StakeData } from "../../../types/staking"
import { StakeType } from "../../../enums"
import NotificationPill from "../../../components/NotificationPill"
import { LabelSm } from "@threshold-network/components"

export const StakeCardHeaderTitle: FC<{ stake: StakeData | null }> = ({
  stake,
}) => {
  const stakeType = !stake
    ? ""
    : stake.stakeType === StakeType.NU || stake.stakeType === StakeType.KEEP
    ? ` - legacy ${StakeType[stake.stakeType]}`
    : " - native"
  return (
    <>
      <NotificationPill colorScheme="brand" mr="2" variant="gradient" />
      <LabelSm textTransform="uppercase" mr="auto">
        stake{stakeType}
      </LabelSm>
    </>
  )
}
