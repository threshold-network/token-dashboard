import { FC } from "react"
import { Flex } from "@chakra-ui/react"
import { Badge } from "@threshold-network/components"
import { StakeCardHeaderTitle } from "./HeaderTitle"
import { StakeData } from "../../../../types"
import { Switcher } from "../Switcher"

export interface StakeCardHeaderProps {
  isInactiveStake: boolean
  stake: StakeData | null
  onSwitcherClick: () => void
  isStakeAction: boolean
}

const StakeCardHeader: FC<StakeCardHeaderProps> = ({
  isInactiveStake,
  stake,
  onSwitcherClick,
  isStakeAction,
}) => {
  return (
    <Flex as="header" alignItems="center">
      <Badge
        colorScheme={isInactiveStake ? "gray" : "green"}
        variant="subtle"
        size="small"
        mr="2"
      >
        {isInactiveStake ? "inactive" : "active"}
      </Badge>
      <StakeCardHeaderTitle stake={stake} />
      <Switcher onClick={onSwitcherClick} isStakeAction={isStakeAction} />
    </Flex>
  )
}

export default StakeCardHeader
