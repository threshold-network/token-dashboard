import { FC, useContext } from "react"
import { Badge, FilterTabs, Flex } from "@threshold-network/components"
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
        tabs={[
          { title: "Stake", tabId: "1" },
          { title: "Unstake", tabId: "2" },
        ]}
        selectedTabId="1"
        size="xs"
        variant="inline"
        onTabClick={onTabClick}
      />
    </Flex>
  )
}

export default StakeCardHeader
