import { FC } from "react"
import { Flex } from "@chakra-ui/react"
import { Badge } from "@threshold-network/components"
import { StakeCardHeaderTitle } from "./HeaderTitle"
import { StakeData } from "../../../../types"
import { Switcher } from "../Switcher"

export interface StakeCardHeaderProps {
  isInActiveStake: boolean
  stake: StakeData | null
  onSwitcherClick: () => void
  isActive: boolean
}

const StakeCardHeader: FC<StakeCardHeaderProps> = ({
  isInActiveStake,
  stake,
  onSwitcherClick,
  isActive,
}) => {
  return (
    <Flex as="header" alignItems="center">
      <Badge
        colorScheme={isInActiveStake ? "gray" : "green"}
        variant="subtle"
        size="small"
        mr="2"
      >
        {isInActiveStake ? "inactive" : "active"}
      </Badge>
      <StakeCardHeaderTitle stake={stake} />
      <Switcher onClick={onSwitcherClick} isActive={isActive} />
    </Flex>
  )
}

export default StakeCardHeader
