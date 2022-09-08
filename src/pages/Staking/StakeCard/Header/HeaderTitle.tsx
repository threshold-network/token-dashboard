import { FC } from "react"
import { StakeData } from "../../../../types/staking"
import NotificationPill from "../../../../components/NotificationPill"
import { LabelSm } from "@threshold-network/components"
import { getStakeTitle } from "../../../../utils/getStakeTitle"

export const StakeCardHeaderTitle: FC<{ stake: StakeData | null }> = ({
  stake,
}) => {
  return (
    <>
      <NotificationPill colorScheme="brand" mr="2" variant="gradient" />
      <LabelSm textTransform="uppercase" mr="auto">
        {getStakeTitle(stake)}
      </LabelSm>
    </>
  )
}
