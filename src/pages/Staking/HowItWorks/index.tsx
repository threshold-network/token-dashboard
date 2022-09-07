import React, { useState } from "react"
import { Box, FilterTabs } from "@threshold-network/components"
import { PageComponent } from "../../../types"
import StakingOverview from "./StakingOverview"
import StakingApplications from "./StakingApplications"
import StakingProviders from "./StakingProviders"
import AnnouncementBanner from "../../../components/AnnouncementBanner"
import stakingHowItWorksIllustrationLight from "../../../static/images/StakingHowItWorksIllustrationLight.png"
import stakingHowItWorksIllustrationDark from "../../../static/images/StakingHowItWorksIllustrationDark.png"
import { useColorMode } from "@chakra-ui/react"

export type StakeHowItWorksTab = "overview" | "applications" | "providers"

const HowItWorksPage: PageComponent = (props) => {
  const [tab, setTab] = useState<StakeHowItWorksTab>("overview")

  const { colorMode } = useColorMode()

  return (
    <Box>
      <AnnouncementBanner
        imgSrc={
          colorMode === "light"
            ? stakingHowItWorksIllustrationLight
            : stakingHowItWorksIllustrationDark
        }
        title="Find more information about staking below, then go to the staking page."
        href="/staking"
        buttonText="Start Staking"
        size="lg"
        hideCloseBtn
        variant="secondary"
        mb={8}
      />
      <FilterTabs
        tabs={[
          { title: "Staking Overview", tabId: "overview" },
          { title: "Staking Applications", tabId: "applications" },
          { title: "Staking Providers", tabId: "providers" },
        ]}
        selectedTabId={tab}
        mb="5"
        onTabClick={(tab) => setTab(tab as StakeHowItWorksTab)}
      />
      {tab === "overview" && <StakingOverview setTab={setTab} />}
      {tab === "applications" && <StakingApplications />}
      {tab === "providers" && <StakingProviders />}
    </Box>
  )
}

HowItWorksPage.route = {
  path: "how-it-works",
  index: false,
  title: "How it Works",
  isPageEnabled: true,
}

export default HowItWorksPage
