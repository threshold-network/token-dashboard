import { Grid } from "@chakra-ui/react"
import { PageComponent } from "../../../types"
import { TbtcBalanceCard } from "./TbtcBalanceCard"
import { MintUnmintNav } from "./MintUnmintNav"
import { MintingCard } from "./MintingCard"
import { UnmintingCard } from "./UnmintingCard"
import { TransactionHistory } from "./TransactionHistory"
import { useTbtcState } from "../../../hooks/useTbtcState"
import { TbtcMintAction } from "../../../types/tbtc"

const TBTCBridge: PageComponent = (props) => {
  const { mintAction } = useTbtcState()

  return (
    <Grid
      maxW="1040px"
      gridAutoColumns="minmax(0, 1fr)"
      gridAutoFlow="column"
      gridTemplate={{
        base: `
            "tbtc-balance           mint-nav      mint-nav      mint-nav"
            "tbtc-balance           mint-card     mint-card     mint-card"
            "transaction-history    mint-card     mint-card     mint-card"
          `,
        xl: `
            "tbtc-balance           mint-nav      mint-nav      mint-nav"
            "tbtc-balance           mint-card     mint-card     mint-card"
            "transaction-history    mint-card     mint-card     mint-card"
          `,
      }}
      gridGap="4"
    >
      <TbtcBalanceCard gridArea="tbtc-balance" />
      <MintUnmintNav gridArea="mint-nav" />
      <TransactionHistory gridArea="transaction-history" />
      {mintAction === TbtcMintAction.mint && (
        <MintingCard gridArea="mint-card" />
      )}
      {mintAction === TbtcMintAction.unmint && (
        <UnmintingCard gridArea="mint-card" />
      )}
    </Grid>
  )
}

TBTCBridge.route = {
  path: "",
  index: false,
  title: "Bridge",
}

export default TBTCBridge
