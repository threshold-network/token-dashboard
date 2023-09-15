import { useEffect, useMemo } from "react"
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
  H4,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  HStack,
  VStack,
  useColorModeValue,
} from "@threshold-network/components"
import {
  Link as RouterLink,
  Outlet,
  useLocation,
  useParams,
} from "react-router-dom"
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
    address,
    isStakingProvider,
    operatorMapping: {
      isInitialFetchDone: isOperatorMappingInitialFetchDone,
      data: mappedOperators,
    },
  } = useAppSelector((state) => state.account)

  return (
    <PageLayout pages={props.pages} title={props.title} maxW={"100%"}>
      <HStack
        alignItems={{ base: "flex-end", lg: "flex-start" }}
        w={"100%"}
        flexDirection={{ base: "column", lg: "row" }}
        spacing={4}
      >
        <VStack w={"100%"} spacing={4} mb={{ base: 10, xl: 0 }}>
          <H4 alignSelf={"flex-start"} mb={10}>
            Your Stake
          </H4>
          {address &&
            isStakingProvider &&
            isOperatorMappingInitialFetchDone &&
            (isAddressZero(mappedOperators.tbtc) ||
              isAddressZero(mappedOperators.randomBeacon)) && (
              <OperatorAddressMappingCard stakingProvider={address} />
            )}
          {hasStakes ? (
            stakes.map((stake) => (
              <StakeCard key={stake.stakingProvider} stake={stake} />
            ))
          ) : (
            <NewStakeCard />
          )}
          {address &&
            isStakingProvider &&
            isOperatorMappingInitialFetchDone &&
            !isAddressZero(mappedOperators.tbtc) &&
            !isAddressZero(mappedOperators.randomBeacon) && (
              <OperatorAddressMappingCard stakingProvider={address} />
            )}
        </VStack>
        <VStack w={"100%"} spacing={4}>
          <H4 alignSelf={"flex-start"} mb={10}>
            Overview
          </H4>
          <RewardsCard
            totalBonusBalance={totalBonusBalance}
            totalRewardsBalance={totalRewardsBalance}
          />
          <StakedPortfolioCard />
          <StakingTVLCard stakingTVL={data.total} />
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

  const breadcrumbColor = useColorModeValue("gray.700", "gray.300")

  return (
    <>
      <Breadcrumb
        separator=">"
        textStyle="bodyLg"
        color={breadcrumbColor}
        mb="10"
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to="/staking">
            Staking
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to={pathname}>
            {lastElementOfTheUrl === "authorize"
              ? "Authorize Applications"
              : "Stake Details"}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
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
          Authorize Applications
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
  pathOverride: "*",
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
