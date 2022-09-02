import { FC } from "react"
import { Grid } from "@chakra-ui/react"
import { ThresholdStakesCard } from "./ThresholdStakesCard"
import { NewTStakesCard } from "./NewTStakesCard"
import { LegacyStakesCard } from "./LegacyStakesCard"
import { StakingActionsCard } from "./StakingActionsCard"
import { AboutAddressesCard } from "./AboutAddressesCard"
import { useTStakingContract } from "../../../../web3/hooks"

const StakingOverview: FC = () => {
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
          "staking-actions"
          "addresses"
        `,
        xl: `
            "t-stakes        legacy-stakes"
            "new-t-stakes    legacy-stakes"
            "new-t-stakes    staking-actions"
            "addresses       staking-actions"
            "addresses       staking-actions"
          `,
      }}
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
      <StakingActionsCard gridArea="staking-actions" />
      <AboutAddressesCard gridArea="addresses" alignSelf="flex-start" />
    </Grid>
  )
}

export default StakingOverview
