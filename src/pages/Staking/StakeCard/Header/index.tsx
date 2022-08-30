import { FC } from "react"
import { Flex } from "@chakra-ui/react"
import { Badge, FilterTabs } from "@threshold-network/components"
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
