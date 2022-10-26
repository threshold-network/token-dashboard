import React, { useEffect, useMemo } from "react"
import {
  Box,
  FilterTabs,
  FilterTab,
  useColorModeValue,
} from "@threshold-network/components"
import StakingOverview from "./StakingOverview"
import StakingApplications from "./StakingApplications"
import StakingProviders from "./StakingProviders"
import AnnouncementBanner from "../../../components/AnnouncementBanner"
import stakingHowItWorksIllustrationLight from "../../../static/images/StakingHowItWorksIllustrationLight.png"
import stakingHowItWorksIllustrationDark from "../../../static/images/StakingHowItWorksIllustrationDark.png"
import { PageComponent } from "../../../types"
import {
  Link as RouterLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom"
import { featureFlags } from "../../../constants"

const HowItWorksPage: PageComponent = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const howItWorksIllustration = useColorModeValue(
    stakingHowItWorksIllustrationLight,
    stakingHowItWorksIllustrationDark
  )

  useEffect(() => {
    if (pathname === "/staking/how-it-works") {
      navigate("/staking/how-it-works/overview")
    }
  }, [pathname, navigate])

  const selectedTabId = useMemo(() => {
    const basePath = `/staking/how-it-works`
    switch (pathname) {
      case `${basePath}/overview`:
        return "1"
      case `${basePath}/applications`:
        return "2"
      case `${basePath}/providers`:
        return "3"
    }
    return "1"
  }, [pathname])

  return (
    <Box>
      <AnnouncementBanner
        variant="secondary"
        imgSrc={howItWorksIllustration}
        title="Find more information about staking below, then go to the staking page."
        href="/staking"
        buttonText="Start Staking"
        size="lg"
        hideCloseBtn
        mb={4}
      />
      {featureFlags.MULTI_APP_STAKING && (
        <FilterTabs selectedTabId={selectedTabId} mb="5" size="lg">
          <FilterTab tabId={"1"} as={RouterLink} to="overview">
            Overview
          </FilterTab>
          <FilterTab tabId={"2"} as={RouterLink} to="applications">
            Applications
          </FilterTab>
          <FilterTab tabId={"3"} as={RouterLink} to="providers">
            Providers
          </FilterTab>
        </FilterTabs>
      )}
      <Outlet />
    </Box>
  )
}

HowItWorksPage.route = {
  path: "how-it-works",
  pathOverride: "how-it-works/*",
  index: false,
  pages: [StakingOverview, StakingApplications, StakingProviders],
  title: "How it works",
  isPageEnabled: true,
}

export default HowItWorksPage
