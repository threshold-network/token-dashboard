import PageLayout from "../PageLayout"
import { PageComponent } from "../../types"
import HowItWorksPage from "./HowItWorks"
import TBTCBridge from "./Bridge"
import { featureFlags } from "../../constants"
import { ExplorerPage } from "./Explorer"
import { ResumeDepositPage } from "./Bridge/ResumeDeposit"

const MainTBTCPage: PageComponent = (props) => {
  const externalLinks = [
    {
      title: "tBTC Explorer",
      href: "https://tbtcscan.com/",
    },
  ]

  return (
    <PageLayout
      title={props.title}
      pages={props.pages}
      externalLinks={externalLinks}
    />
  )
}

MainTBTCPage.route = {
  path: "tBTC",
  index: false,
  pages: [HowItWorksPage, TBTCBridge, ExplorerPage, ResumeDepositPage],
  title: "tBTC",
  isPageEnabled: featureFlags.TBTC_V2,
}

export default MainTBTCPage
