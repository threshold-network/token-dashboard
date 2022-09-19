import { ComponentProps, FC } from "react"
import { Box } from "@chakra-ui/react"
import { Card, FilterTabs, FilterTab } from "@threshold-network/components"
import { TbtcMintingType } from "../../../types/tbtc"
import { useTbtcState } from "../../../hooks/useTbtcState"

export const MintUnmintNav: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  const { mintingType, updateState } = useTbtcState()

  return (
    <Box {...props}>
      <FilterTabs
        selectedTabId={mintingType}
        onTabClick={(tabId) => updateState("mintingType", tabId)}
      >
        <FilterTab tabId={TbtcMintingType.mint}>Mint</FilterTab>
        <FilterTab tabId={TbtcMintingType.unmint}>Unmint</FilterTab>
      </FilterTabs>
    </Box>
  )
}
