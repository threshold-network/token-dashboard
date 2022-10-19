import { useEffect, useMemo } from "react"
import { HStack, VStack } from "@chakra-ui/react"
import StakingTVLCard from "./StakingTVLCard"
import StakedPortfolioCard from "./StakedPortfolioCard"
import PageLayout from "../PageLayout"
import StakeCard from "./StakeCard"
import RewardsCard from "./RewardsCard"
import { useFetchTvl } from "../../hooks/useFetchTvl"
import { useStakingState } from "../../hooks/useStakingState"
import { PageComponent } from "../../types"
import HowItWorksPage from "./HowItWorks"
import { useDispatch, useSelector } from "react-redux"
import {
  selectTotalBonusBalance,
  selectTotalRewardsBalance,
} from "../../store/rewards"
import AuthorizeStakingAppsPage from "./AuthorizeStakingApps"
import {
  FilterTabs,
  FilterTab,
  BodyLg,
  H4,
} from "@threshold-network/components"
import { Link, Outlet, useLocation, useParams } from "react-router-dom"
import { Link as RouterLink } from "react-router-dom"
import { stakingApplicationsSlice } from "../../store/staking-applications/slice"
import StakeDetailsPage from "./StakeDetailsPage"
import NewStakeCard from "./NewStakeCard"
import OperatorAddressMappingCard from "./OperatorAddressMappingCard"
import { isAddressZero } from "../../web3/utils"
import { useAppSelector } from "../../hooks/store"

const StakingPage: PageComponent = (props) => {
  const [data, fetchtTvlData] = useFetchTvl()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(stakingApplicationsSlice.actions.getSupportedApps({}))
  }, [dispatch])

  useEffect(() => {
    fetchtTvlData()
  }, [fetchtTvlData])
  const { stakes } = useStakingState()
  const totalRewardsBalance = useSelector(selectTotalRewardsBalance)
  const totalBonusBalance = useSelector(selectTotalBonusBalance)
  const hasStakes = stakes.length > 0

  const {
    isStakingProvider,
    operatorMapping: {
      isInitialFetchDone: isOperatorMappingInitialFetchDone,
      data: { mappedOperators },
    },
  } = useAppSelector((state) => state.account)

  return (
    <PageLayout pages={props.pages} title={props.title} maxW={"100%"}>
      <HStack
        alignItems={{ base: "flex-end", lg: "flex-start" }}
        w={"100%"}
        flexDirection={{ base: "column", lg: "row" }}
        spacing={5}
      >
        <VStack w={"100%"} spacing={5} mb={{ base: "5", lg: "0" }}>
          <H4
            alignSelf={"flex-start"}
            display={{ sm: "none", xl: "block" }}
            mb={10}
          >
            Your Stake
          </H4>
          {isStakingProvider &&
            isOperatorMappingInitialFetchDone &&
            (isAddressZero(mappedOperators.tbtc) ||
              isAddressZero(mappedOperators.randomBeacon)) && (
              <OperatorAddressMappingCard
                mappedOperatorTbtc={mappedOperators.tbtc}
                mappedOperatorRandomBeacon={mappedOperators.randomBeacon}
              />
            )}
          {hasStakes ? (
            stakes.map((stake) => (
              <StakeCard key={stake.stakingProvider} stake={stake} />
            ))
          ) : (
            <NewStakeCard />
          )}
        </VStack>

        <VStack w={"100%"} spacing={5}>
          <H4
            alignSelf={"flex-start"}
            display={{ sm: "none", lg: "block" }}
            mb={10}
          >
            Overview
          </H4>
          <RewardsCard
            totalBonusBalance={totalBonusBalance}
            totalRewardsBalance={totalRewardsBalance}
          />
          <StakedPortfolioCard />
          <StakingTVLCard tvl={data.total} pb={"3rem"} />
          {hasStakes && <NewStakeCard />}
        </VStack>
      </HStack>
    </PageLayout>
  )
}

const StakingProviderDetails: PageComponent = (props) => {
  const { stakingProviderAddress } = useParams()
  const { pathname } = useLocation()
  const lastElementOfTheUrl = pathname.split("/").at(-1)

  const selectedTabId = useMemo(() => {
    if (pathname.includes("details")) {
      return "1"
    }
    if (pathname.includes("authorize")) {
      return "2"
    }
  }, [pathname])

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
      <FilterTabs selectedTabId={selectedTabId} mb="5" size="lg">
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
      </FilterTabs>
      <Outlet />
    </>
  )
}

const Details: PageComponent = () => {
  return <StakeDetailsPage />
}

const Auth: PageComponent = () => {
  return <AuthorizeStakingAppsPage />
}

const MainStakingPage: PageComponent = (props) => {
  return (
    <PageLayout
      pages={props.pages}
      title={props.title}
      maxW={{ base: "2xl", lg: "4xl", xl: "6xl" }}
    />
  )
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
  pages: [HowItWorksPage, StakingPage, StakingProviderDetails],
  title: "Staking",
  isPageEnabled: true,
}

export default MainStakingPage
