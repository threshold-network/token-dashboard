import { FC } from "react"
import NotificationPill from "../../../../components/NotificationPill"
import { LabelSm } from "@threshold-network/components"
import { getStakeTitle } from "../../../../utils/getStakeTitle"
import { StakeType } from "../../../../enums"

export const StakeCardHeaderTitle: FC<{ stakeType?: StakeType }> = ({
  stakeType,
}) => {
  return (
    <>
      <NotificationPill colorScheme="brand" mr="2" variant="gradient" />
      <LabelSm textTransform="uppercase" mr="auto">
        {getStakeTitle(stakeType)}
      </LabelSm>
    </>
  )
}
