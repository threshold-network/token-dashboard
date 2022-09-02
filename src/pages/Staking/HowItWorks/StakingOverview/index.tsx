import { FC } from "react"
import { Grid } from "@chakra-ui/react"
import { ThresholdStakesCard } from "./ThresholdStakesCard"
import { NewTStakesCard } from "./NewTStakesCard"
import { LegacyStakesCard } from "./LegacyStakesCard"
import { StakingActionsCard } from "./StakingActionsCard"
import { AboutAddressesCard } from "./AboutAddressesCard"
import { useTStakingContract } from "../../../../web3/hooks"
import { AuthorizingApplicationsCard } from "./AuthorizingApplicationsCard"
import { StakeHowItWorksTab } from ".."

const StakingOverview: FC<{ setTab: (tab: StakeHowItWorksTab) => void }> = ({
  setTab,
}) => {
  const tStakingContract = useTStakingContract()
  return (
    <Grid
      gridAutoColumns="minmax(0, 1fr)"
      gridAutoFlow="column"
      gridTemplate={{
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
            "staking-actions   authorizing-apps" 
            "staking-actions   addresses"
          `,
      }}
      gridGap="4"
    >
      <ThresholdStakesCard
        gridArea="t-stakes"
        tStakingContractAddress={tStakingContract?.address!}
      />
      <LegacyStakesCard
        setTab={setTab}
        gridArea="legacy-stakes"
        tStakingContractAddress={tStakingContract?.address!}
      />
      <NewTStakesCard gridArea="new-t-stakes" />
      <AuthorizingApplicationsCard gridArea="authorizing-apps" />
      <StakingActionsCard gridArea="staking-actions" />
      <AboutAddressesCard gridArea="addresses" alignSelf="flex-start" />
    </Grid>
  )
}

export default StakingOverview
