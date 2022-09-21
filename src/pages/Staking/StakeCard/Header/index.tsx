import { FC } from "react"
import {
  Badge,
  FilterTabs,
  FilterTab,
  Flex,
} from "@threshold-network/components"
import { StakeCardHeaderTitle } from "./HeaderTitle"
import { useStakeCardContext } from "../../../../hooks/useStakeCardContext"
import { StakeType } from "../../../../enums"

export interface StakeCardHeaderProps {
  stakeType?: StakeType
  onTabClick: () => void
}

const StakeCardHeader: FC<StakeCardHeaderProps> = ({
  stakeType,
  onTabClick,
}) => {
  const { isInactiveStake } = useStakeCardContext()

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
      <StakeCardHeaderTitle stakeType={stakeType} />
      <FilterTabs
        selectedTabId="1"
        size="xs"
        variant="inline"
        onTabClick={onTabClick}
      >
        <FilterTab tabId={"1"}>Stake</FilterTab>
        <FilterTab tabId={"2"}>Unstake</FilterTab>
      </FilterTabs>
    </Flex>
  )
}

export default StakeCardHeader
