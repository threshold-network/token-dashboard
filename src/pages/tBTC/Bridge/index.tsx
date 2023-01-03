import { Grid, Box } from "@threshold-network/components"
import { PageComponent } from "../../../types"
import { TbtcBalanceCard } from "./TbtcBalanceCard"
import { MintUnmintNav } from "./MintUnmintNav"
import { MintingCard } from "./MintingCard"
import { UnmintingCard } from "./UnmintingCard"
import { TransactionHistory } from "./TransactionHistory"
import { useTbtcState } from "../../../hooks/useTbtcState"
import { TbtcMintingType } from "../../../types/tbtc"

const gridTemplateAreas = {
  base: `
    "main"
    "aside"
    `,
  xl: `"aside main"`,
}

const TBTCBridge: PageComponent = (props) => {
  const { mintingType } = useTbtcState()

  return (
    <Grid
      gridTemplateAreas={gridTemplateAreas}
      gridTemplateColumns={{ base: "1fr", xl: "25% 1fr" }}
      gap="5"
    >
      <Box gridArea="main">
        <MintUnmintNav w="100%" gridArea="nav" mb="5" />
        {mintingType === TbtcMintingType.mint && (
          <MintingCard gridArea="main-card" p={35} />
        )}
        {mintingType === TbtcMintingType.unmint && (
          <UnmintingCard gridArea="main-card" p={35} />
        )}
      </Box>
      <Box gridArea="aside">
        <TbtcBalanceCard gridArea="balance-card" mb="5" />
        <TransactionHistory gridArea="tx-history" mb="5" />
      </Box>
    </Grid>
  )
}

TBTCBridge.route = {
  path: "",
  index: false,
  title: "Bridge",
  isPageEnabled: true,
}

export default TBTCBridge
