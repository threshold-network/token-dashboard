import { SimpleGrid, Stack } from "@chakra-ui/react"
import StakingChecklistCard from "./StakingChecklistCard"
import StakedPortfolioCard from "./StakedPortfolioCard"
import { useStakingState } from "../../hooks/useStakingState"
import { PageComponent } from "../../types"
import PageLayout from "../PageLayout"
import StakeCard from "./StakeCard"

const StakingPage: PageComponent = (props) => {
  const { stakes } = useStakingState()

  return (
    <PageLayout {...props}>
      <Stack direction={{ base: "column", lg: "row" }} w="100%">
        <StakedPortfolioCard />
        <StakingChecklistCard />
      </Stack>
      {stakes.length > 0 && (
        <SimpleGrid columns={[1, null, null, 2]} spacing="4" w="100%" mt="4">
          {stakes.map((stake) => (
            <StakeCard key={stake.stakingProvider} stake={stake} />
          ))}
        </SimpleGrid>
      )}
    </PageLayout>
  )
}

StakingPage.route = {
  path: "staking",
  index: false,
  title: "Staking",
}

export default StakingPage
