import PageLayout from "../PageLayout"
import { PageComponent } from "../../types"
import HowItWorksPage from "./HowItWorks"
import TBTCBridge from "./Bridge"
import { featureFlags } from "../../constants"
import { ExplorerPage } from "./Explorer"

const MainTBTCPage: PageComponent = (props) => {
  return <PageLayout title={props.title} pages={props.pages} />
}

MainTBTCPage.route = {
  path: "tBTC",
  index: false,
  pages: [TBTCBridge, HowItWorksPage, ExplorerPage],
  title: "tBTC",
  isPageEnabled: featureFlags.TBTC_V2 || featureFlags.BUILD_TBTC_V2_ONLY,
}

export default MainTBTCPage
