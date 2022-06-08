import { useEffect } from "react"
import { SimpleGrid, Stack } from "@chakra-ui/react"
import StakingTVLCard from "./StakingTVLCard"
import StakedPortfolioCard from "./StakedPortfolioCard"
import PageLayout from "../PageLayout"
import StakeCard from "./StakeCard"
import RewardsCard from "./RewardsCard"
import { StakingBonusBanner } from "../../components/StakingBonus"
import { useFetchTvl } from "../../hooks/useFetchTvl"
import { useStakingState } from "../../hooks/useStakingState"
import { PageComponent } from "../../types"
import HowItWorksPage from "./HowItWorks"

const StakingPage: PageComponent = (props) => {
  const [data, fetchtTvlData] = useFetchTvl()

  useEffect(() => {
    fetchtTvlData()
  }, [fetchtTvlData])
  const { stakes, totalBonusBalance, totalRewardsBalance } = useStakingState()

  return (
    <PageLayout {...props}>
      <StakingBonusBanner />
      <SimpleGrid
        columns={[1, null, null, 2]}
        spacing="4"
        w="100%"
        mt="4"
        alignItems="self-start"
      >
        <StakedPortfolioCard />
        <Stack spacing={4}>
          <RewardsCard
            totalBonusBalance={totalBonusBalance}
            totalRewardsBalance={totalRewardsBalance}
          />
          <StakingTVLCard tvl={data.total} />
        </Stack>
        {stakes.map((stake) => (
          <StakeCard key={stake.stakingProvider} stake={stake} />
        ))}
      </SimpleGrid>
    </PageLayout>
  )
}

StakingPage.route = {
  path: "",
  index: false,
  title: "Staking",
}

const MainStakingPage: PageComponent = (props) => {
  return <PageLayout {...props} />
}

MainStakingPage.route = {
  path: "staking",
  index: true,
  pages: [StakingPage, HowItWorksPage],
  title: "Staking",
}

export default MainStakingPage
