import { H1, Container, Image } from "@threshold-network/components"
import { Outlet } from "react-router-dom"
import thresholdWordMark from "../../static/images/thresholdWordMark.svg"
import useDocumentTitle from "../../hooks/useDocumentTitle"
import Network from "./Network"
import { PageComponent } from "../../types"
import { featureFlags } from "../../constants"
import AnnouncementBanner from "../../components/AnnouncementBanner"
import tbtcAppBannerIllustration from "../../static/images/tBTCAppBanner.svg"
import PageLayout from "../PageLayout"

const Overview: PageComponent = () => {
  useDocumentTitle("Threshold - Overview")

  return (
    <PageLayout title="Overview">
      <Container maxW={{ base: "2xl", xl: "6xl" }} my={16}>
        <Image src={thresholdWordMark} mb={4} />
        <H1 mb={12}>Overview</H1>
        {featureFlags.TBTC_V2 && (
          <AnnouncementBanner
            variant="primary"
            imgSrc={tbtcAppBannerIllustration}
            preTitle="get started"
            title="Get your Bitcoin to work!"
            href="/tBTC"
            buttonText="Mint tBTC"
          />
        )}
        <Outlet />
      </Container>
    </PageLayout>
  )
}

Overview.route = {
  path: "overview",
  index: false,
  pages: [Network],
  isPageEnabled: true,
}

export default Overview
