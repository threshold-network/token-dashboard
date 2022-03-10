import { useEffect } from "react"
import { SimpleGrid, Stack } from "@chakra-ui/react"
import StakingTVLCard from "./StakingTVLCard"
import StakedPortfolioCard from "./StakedPortfolioCard"
import PageLayout from "../PageLayout"
import StakeCard from "./StakeCard"
import RewardsCard from "./RewardsCard"
import { useFetchTvl } from "../../hooks/useFetchTvl"
import { useStakingState } from "../../hooks/useStakingState"
import { PageComponent } from "../../types"

const StakingPage: PageComponent = (props) => {
  const [data, fetchtTvlData] = useFetchTvl()

  useEffect(() => {
    fetchtTvlData()
  }, [fetchtTvlData])
  const { stakes } = useStakingState()

  return (
    <PageLayout {...props}>
      <Stack direction={{ base: "column", lg: "row" }} spacing="4">
        <StakedPortfolioCard flex={{ base: 1, lg: 50 }} />
        <Stack flex={{ base: 1, lg: 50 }} spacing={4}>
          <RewardsCard />
          <StakingTVLCard tvl={data.total} />
        </Stack>
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
