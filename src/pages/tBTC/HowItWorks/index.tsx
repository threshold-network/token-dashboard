import { Grid } from "@chakra-ui/react"
import { AboutAddressesCard } from "./AboutAddressesCard"
import { DecentralizedSolution } from "./DecentralizedSolution"
import { DepositAddressCard } from "./DepositAddressCard"
import { ProvidersCard } from "./ProvidersCard"
import { BridgeCrossingCard } from "./BridgeCrossingCard"
import { TbtcBridgeCard } from "./TbtcBridgeCard"
import { PageComponent } from "../../../types"

const HowItWorksPage: PageComponent = (props) => {
  return (
    <Grid
      gridAutoColumns="minmax(0, 1fr)"
      gridAutoFlow="column"
      gridTemplate={{
        base: `
          "tbtc-bridge"
          "decentralized-solution"
          "deposit-address"
          "bridge-crossing"
          "addresses"
          "providers"
        `,
        xl: `
            "t-stakes                   deposit-address"
            "decentralized-solution     deposit-address"
            "decentralized-solution     bridge-crossing"
            "addresses                  bridge-crossing"
            "addresses                  providers"
          `,
      }}
      gridGap="4"
    >
      <TbtcBridgeCard gridArea="tbtc-bridge" />
      <DepositAddressCard gridArea="deposit-address" />
      <DecentralizedSolution gridArea="decentralized-solution" />
      <BridgeCrossingCard gridArea="bridge-crossing" />
      <AboutAddressesCard gridArea="addresses" alignSelf="flex-start" />
      <ProvidersCard gridArea="providers" />
    </Grid>
  )
}

HowItWorksPage.route = {
  path: "how-it-works",
  index: false,
  title: "How it Works",
}

export default HowItWorksPage
