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
  pages: [HowItWorksPage, TBTCBridge, ExplorerPage],
  title: "tBTC",
  isPageEnabled: featureFlags.TBTC_V2,
}

export default MainTBTCPage
