import { ComponentProps, FC } from "react"
import { Box } from "@chakra-ui/react"
import {
  Card,
  // FilterTabs
} from "@threshold-network/components"
import { TbtcMintingType } from "../../../types/tbtc"
import { useTbtcState } from "../../../hooks/useTbtcState"

export const MintUnmintNav: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  const { mintingType, updateState } = useTbtcState()

  return (
    <Box {...props}>
      {/*<FilterTabs*/}
      {/*  selectedTabId={mintingType}*/}
      {/*  setSelectedTabId={(tabId) => updateState("mintingType", tabId)}*/}
      {/*  tabs={[*/}
      {/*    {*/}
      {/*      title: "Mint",*/}
      {/*      tabId: TbtcMintingType.mint,*/}
      {/*    },*/}
      {/*    {*/}
      {/*      title: "Unmint",*/}
      {/*      tabId: TbtcMintingType.unmint,*/}
      {/*    },*/}
      {/*  ]}*/}
      {/*/>*/}
    </Box>
  )
}
