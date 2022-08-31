import React, { useState } from "react"
import { Box, FilterTabs } from "@threshold-network/components"
import { PageComponent } from "../../../types"
import StakingOverview from "./StakingOverview"
import StakingApplications from "./StakingApplications"
import StakingProviders from "./StakingProviders"
import AnnouncementBanner from "../../../components/AnnouncementBanner"
import stakingHowItWorksIllustration from "../../../static/images/StakingHowItWorksIllustration.png"

type StakeHowItWorksTab = "overview" | "applications" | "providers"

const HowItWorksPage: PageComponent = (props) => {
  const [tab, setTab] = useState<StakeHowItWorksTab>("overview")

  return (
    <Box>
      <AnnouncementBanner
        imgSrc={stakingHowItWorksIllustration}
        title="Find more information about staking below, then go to the staking page."
        href="/staking"
        buttonText="Start Staking"
        size="lg"
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
      {tab === "overview" && <StakingOverview />}
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
