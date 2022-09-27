import { Grid } from "@chakra-ui/react"
import { ThresholdStakesCard } from "./ThresholdStakesCard"
import { NewTStakesCard } from "./NewTStakesCard"
import { LegacyStakesCard } from "./LegacyStakesCard"
import { StakingActionsCard } from "./StakingActionsCard"
import { AboutAddressesCard } from "./AboutAddressesCard"
import { useTStakingContract } from "../../../../web3/hooks"
import { AuthorizingApplicationsCard } from "./AuthorizingApplicationsCard"
import { PageComponent } from "../../../../types"
import { featureFlags } from "../../../../constants"
import { ProvidersCardNonMAS } from "./ProvidersCardNonMAS"

const gridTemplate = featureFlags.MULTI_APP_STAKING
  ? {
      base: `
          "t-stakes"
          "legacy-stakes"
          "new-t-stakes"
          "authorizing-apps"
          "staking-actions"
          "addresses"
        `,
      xl: `
            "t-stakes          legacy-stakes"
            "new-t-stakes      legacy-stakes"
            "new-t-stakes      authorizing-apps"
            "new-t-stakes      authorizing-apps"
            "staking-actions   authorizing-apps" 
            "addresses         authorizing-apps"
          `,
    }
  : {
      base: `
          "t-stakes"
          "legacy-stakes"
          "new-t-stakes"
          "staking-actions"
          "addresses"
          "providers-card-non-mas"
        `,
      xl: `
            "t-stakes        new-t-stakes"
            "legacy-stakes   new-t-stakes"
            "legacy-stakes   staking-actions"
            "addresses       staking-actions"
            "addresses       staking-actions"
            "addresses       providers-card-non-mas"
          `,
    }

const StakingOverview: PageComponent = () => {
  const tStakingContract = useTStakingContract()
  return (
    <Grid
      gridAutoColumns="minmax(0, 1fr)"
      gridAutoFlow="column"
      gridTemplate={gridTemplate}
      gridGap="4"
    >
      <ThresholdStakesCard
        gridArea="t-stakes"
        tStakingContractAddress={tStakingContract?.address!}
      />
      <LegacyStakesCard
        gridArea="legacy-stakes"
        tStakingContractAddress={tStakingContract?.address!}
      />
      <NewTStakesCard gridArea="new-t-stakes" />
      {featureFlags.MULTI_APP_STAKING && (
        <AuthorizingApplicationsCard gridArea="authorizing-apps" />
      )}
      <StakingActionsCard gridArea="staking-actions" />
      <AboutAddressesCard gridArea="addresses" alignSelf="flex-start" />
      {!featureFlags.MULTI_APP_STAKING && (
        <ProvidersCardNonMAS gridArea="providers-card-non-mas" />
      )}
    </Grid>
  )
}

StakingOverview.route = {
  path: "overview",
  index: false,
  isPageEnabled: true,
}

export default StakingOverview
