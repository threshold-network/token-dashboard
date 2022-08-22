import { Grid } from "@chakra-ui/react"
import { ContractsCard } from "./ContractsCard"
import { DecentralizedSolution } from "./DecentralizedSolution"
import { DepositAddressCard } from "./DepositAddressCard"
import { AuditsCard } from "./AuditsCard"
import { BridgeCrossingCard } from "./BridgeCrossingCard"
import { TbtcBridgeCard } from "./TbtcBridgeCard"
import { PageComponent } from "../../../types"

const HowItWorksPage: PageComponent = (props) => {
  return (
    <Grid
      maxW="1040px"
      gridAutoColumns="minmax(0, 1fr)"
      gridAutoFlow="column"
      gridTemplate={{
        base: `
          "tbtc-bridge"
          "decentralized-solution"
          "deposit-address"
          "bridge-crossing"
          "contracts"
          "audits"
        `,
        xl: `
            "tbtc-bridge                deposit-address"
            "decentralized-solution     deposit-address"
            "decentralized-solution     bridge-crossing"
            "contracts                  bridge-crossing"
            "contracts                  audits"
          `,
      }}
      gridGap="4"
    >
      <TbtcBridgeCard gridArea="tbtc-bridge" />
      <DepositAddressCard gridArea="deposit-address" />
      <DecentralizedSolution gridArea="decentralized-solution" />
      <BridgeCrossingCard gridArea="bridge-crossing" />
      <ContractsCard gridArea="contracts" alignSelf="flex-start" />
      <AuditsCard gridArea="audits" />
    </Grid>
  )
}

HowItWorksPage.route = {
  path: "how-it-works",
  index: false,
  title: "How it Works",
  isPageEnabled: true,
}

export default HowItWorksPage
