import { useEffect } from "react"
import { Button, SimpleGrid, Stack } from "@chakra-ui/react"
import StakingTVLCard from "./StakingTVLCard"
import StakedPortfolioCard from "./StakedPortfolioCard"
import PageLayout from "../PageLayout"
import StakeCard from "./StakeCard"
import RewardsCard from "./RewardsCard"
import { useFetchTvl } from "../../hooks/useFetchTvl"
import { useStakingState } from "../../hooks/useStakingState"
import { PageComponent } from "../../types"
import HowItWorksPage from "./HowItWorks"
import { useSelector } from "react-redux"
import {
  selectTotalBonusBalance,
  selectTotalRewardsBalance,
} from "../../store/rewards"
import AuthorizeStakingAppsPage from "./AuthorizeStakingApps"
import {
  FilterTabList,
  FilterTab,
  H1,
  BodyLg,
} from "@threshold-network/components"
import { Link, Outlet, useLocation, useParams } from "react-router-dom"
import { Link as RouterLink } from "react-router-dom"

const StakingPage: PageComponent = (props) => {
  const [data, fetchtTvlData] = useFetchTvl()

  useEffect(() => {
    fetchtTvlData()
  }, [fetchtTvlData])
  const { stakes } = useStakingState()
  const totalRewardsBalance = useSelector(selectTotalRewardsBalance)
  const totalBonusBalance = useSelector(selectTotalBonusBalance)

  return (
    <PageLayout {...props}>
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

const StakingProviderDetails: PageComponent = (props) => {
  const { stakingProviderAddress } = useParams()
  const { pathname } = useLocation()
  const lastElementOfTheUrl = pathname.split("/").at(-1)

  return (
    <>
      <BodyLg mb={5}>
        <Link to={"/staking"}>Staking</Link>
        {" > "}
        <Link to={pathname}>
          Stake{" "}
          {lastElementOfTheUrl === "authorize" ? "applications" : "details"}
        </Link>
      </BodyLg>
      <FilterTabList selectedTabId="2" mb="5" size="lg">
        <FilterTab
          tabId={"1"}
          as={RouterLink}
          to={`/staking/${stakingProviderAddress}/details`}
        >
          Stake Details
        </FilterTab>
        <FilterTab
          tabId={"2"}
          as={RouterLink}
          to={`/staking/${stakingProviderAddress}/authorize`}
        >
          Authorize Application
        </FilterTab>
      </FilterTabList>
      <Outlet />
    </>
  )
}

const Details: PageComponent = () => {
  const { stakingProvider } = useParams()

  return <H1>Staking provider {stakingProvider} overview</H1>
}

const Auth: PageComponent = () => {
  return <AuthorizeStakingAppsPage />
}

const MainStakingPage: PageComponent = (props) => {
  return <PageLayout {...props} />
}

StakingProviderDetails.route = {
  path: ":stakingProviderAddress",
  index: false,
  pages: [Details, Auth],
  isPageEnabled: true,
}

Details.route = {
  path: "details",
  index: true,
  isPageEnabled: true,
}

Auth.route = {
  path: "authorize",
  index: false,
  isPageEnabled: true,
}

StakingPage.route = {
  path: "",
  index: false,
  title: "Staking",
  isPageEnabled: true,
}

MainStakingPage.route = {
  path: "staking",
  index: true,
  pages: [StakingPage, HowItWorksPage, StakingProviderDetails],
  title: "Staking",
  isPageEnabled: true,
}

export default MainStakingPage
