import { useState } from "react"
import { Grid } from "@chakra-ui/react"
import { PageComponent } from "../../../types"
import { SweepTimer } from "./SweepTimer"
import { TbtcBalanceCard } from "./TbtcBalanceCard"
import { TbtcFeeCalculator } from "./TbtcFeeCalculator"
import { MintUnmintNav } from "./MintUnmintNav"
import { MintingCard } from "./MintingCard"
import { MintingTimelineCard } from "./MintingTimelineCard"
import { UnmintingCard } from "./UnmintingCard"

const TBTCBridge: PageComponent = (props) => {
  const [selectedAction, setSelectedAction] = useState<"MINT" | "UNMINT">(
    "MINT"
  )

  return (
    <Grid
      maxW="1040px"
      gridAutoColumns="minmax(0, 1fr)"
      gridAutoFlow="column"
      gridTemplate={{
        base: `
          "mint-nav"
          "mint-card"
          "sweep-timer"
          "tbtc-balance"
          "fee-calculator"
          "mint-timeline"
        `,
        xl: `
            "sweep-timer      mint-nav      mint-nav      mint-timeline"
            "sweep-timer      mint-card     mint-card     mint-timeline"
            "tbtc-balance     mint-card     mint-card     mint-timeline"
            "fee-calculator   mint-card     mint-card     mint-timeline"
          `,
      }}
      gridGap="4"
    >
      <SweepTimer gridArea="sweep-timer" />
      <TbtcBalanceCard gridArea="tbtc-balance" />
      <TbtcFeeCalculator gridArea="fee-calculator" />
      <MintUnmintNav
        {...{ selectedAction, setSelectedAction }}
        gridArea="mint-nav"
      />
      {selectedAction === "MINT" && <MintingCard gridArea="mint-card" />}
      {selectedAction === "UNMINT" && <UnmintingCard gridArea="mint-card" />}
      <MintingTimelineCard gridArea="mint-timeline" />
    </Grid>
  )
}

TBTCBridge.route = {
  path: "",
  index: false,
  title: "Bridge",
}

export default TBTCBridge
