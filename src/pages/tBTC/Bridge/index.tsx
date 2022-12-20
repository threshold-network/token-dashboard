import { Grid } from "@threshold-network/components"
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
            "nav"
            "main-card"
            "balance-card"
            "tx-history"
          `,
  xl: `
              "balance-card           nav"
              "balance-card     main-card"
              "tx-history       main-card"
            `,
}

const TBTCBridge: PageComponent = (props) => {
  const { mintingType } = useTbtcState()

  return (
    <Grid gridTemplateAreas={gridTemplateAreas} gap="5" alignItems="flex-start">
      <MintUnmintNav w="100%" gridArea="nav" />
      <TbtcBalanceCard gridArea="balance-card" alignSelf="stretch" />
      <TransactionHistory gridArea="tx-history" />
      {mintingType === TbtcMintingType.mint && (
        <MintingCard gridArea="main-card" p={35} />
      )}
      {mintingType === TbtcMintingType.unmint && (
        <UnmintingCard gridArea="main-card" p={35} />
      )}
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
