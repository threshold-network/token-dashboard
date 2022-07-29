import { Box, Grid } from "@chakra-ui/react"
import { AboutAddressesCard } from "./AboutAddressesCard"
import { LegacyStakesCard } from "./LegacyStakesCard"
import { NewTStakesCard } from "./NewTStakesCard"
import { ProvidersCard } from "./ProvidersCard"
import { StakingActionsCard } from "./StakingActionsCard"
import { ThresholdStakesCard } from "./ThresholdStakesCard"
import { PageComponent } from "../../../types"
import { useTStakingContract } from "../../../web3/hooks"
import { LearnAboutStakingHero } from "./LearnAboutStakingHero"

const HowItWorksPage: PageComponent = (props) => {
  const tStakingContract = useTStakingContract()

  return (
    <Box>
      <LearnAboutStakingHero
        tStakingContractAddress={tStakingContract?.address!}
      />
      <Grid
        gridAutoColumns="minmax(0, 1fr)"
        gridAutoFlow="column"
        gridTemplate={{
          base: `
          "t-stakes"
          "legacy-stakes"
          "new-t-stakes"
          "staking-actions"
          "addresses"
          "providers"
        `,
          xl: `
            "t-stakes        new-t-stakes"
            "legacy-stakes   new-t-stakes"
            "legacy-stakes   staking-actions"
            "addresses       staking-actions"
            "addresses       staking-actions"
            "addresses       providers"
          `,
        }}
        gridGap="4"
      >
        <ThresholdStakesCard
          gridArea="t-stakes"
          tStakingContractAddress={tStakingContract?.address!}
        />
        <NewTStakesCard gridArea="new-t-stakes" />
        <LegacyStakesCard
          gridArea="legacy-stakes"
          tStakingContractAddress={tStakingContract?.address!}
        />
        <StakingActionsCard gridArea="staking-actions" />
        <AboutAddressesCard gridArea="addresses" alignSelf="flex-start" />
        <ProvidersCard gridArea="providers" />
      </Grid>
    </Box>
  )
}

HowItWorksPage.route = {
  path: "how-it-works",
  index: false,
  title: "How it Works",
}

export default HowItWorksPage
