import { FC } from "react"
import {
  Badge,
  FilterTabList,
  FilterTab,
  Flex,
} from "@threshold-network/components"
import { StakeCardHeaderTitle } from "./HeaderTitle"
import { StakeData } from "../../../../types"

export interface StakeCardHeaderProps {
  isInactiveStake: boolean
  stake: StakeData | null
  onTabClick: () => void
}

const StakeCardHeader: FC<StakeCardHeaderProps> = ({
  isInactiveStake,
  stake,
  onTabClick,
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
      <FilterTabList
        selectedTabId="1"
        size="xs"
        variant="inline"
        onTabClick={onTabClick}
      >
        <FilterTab tabId={"1"}>Stake</FilterTab>
        <FilterTab tabId={"2"}>Unstake</FilterTab>
      </FilterTabList>
    </Flex>
  )
}

export default StakeCardHeader
