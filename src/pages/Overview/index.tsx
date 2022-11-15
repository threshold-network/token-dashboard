import { Container, Image } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"
import thresholdWordMark from "../../static/images/thresholdWordMark.svg"
import { H1 } from "@threshold-network/components"
import useDocumentTitle from "../../hooks/useDocumentTitle"
import Network from "./Network"
import { PageComponent } from "../../types"
import { AuthorizeApplicationsBanner } from "./AuthorizeApplicationsBanner"
import { featureFlags } from "../../constants"
import AnalyticsBanner from "./AnalyticsBanner"

const FEEDBACK_MODULE = true

const Overview: PageComponent = () => {
  useDocumentTitle("Threshold - Overview")

  return (
    <Container maxW={{ base: "2xl", xl: "6xl" }} my={16}>
      <Image src={thresholdWordMark} mb={4} />
      <H1 mb={12}>Overview</H1>
      {FEEDBACK_MODULE && <AnalyticsBanner />}
      {featureFlags.MULTI_APP_STAKING && <AuthorizeApplicationsBanner />}
      <Outlet />
    </Container>
  )
}

Overview.route = {
  path: "overview",
  index: false,
  pages: [Network],
  isPageEnabled: true,
}

export default Overview
