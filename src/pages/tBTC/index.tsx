import PageLayout from "../PageLayout"
import { PageComponent } from "../../types"
import HowItWorksPage from "./HowItWorks"
import TBTCBridge from "./TbtcBridge"

const MainTBTCPage: PageComponent = (props) => {
  return <PageLayout {...props} />
}

MainTBTCPage.route = {
  path: "tBTC",
  index: true,
  pages: [TBTCBridge, HowItWorksPage],
  title: "TBTC",
}

export default MainTBTCPage
