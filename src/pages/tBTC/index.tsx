import PageLayout from "../PageLayout"
import { PageComponent } from "../../types"
import HowItWorksPage from "./HowItWorks"
import TBTCBridge from "./Bridge"
import { featureFlags } from "../../constants"
import { ExplorerPage } from "./Explorer"
import { ResumeDepositPage } from "./Bridge/ResumeDeposit"
import { useIsActive } from "../../hooks/useIsActive"
import { SupportedChainIds } from "../../networks/enums/networks"

const MainTBTCPage: PageComponent = (props) => {
  const { chainId } = useIsActive()
  const externalLinks = [
    {
      title: "tBTC Explorer",
      href: "https://tbtcscan.com/",
    },
    {
      title: "Loyalty Program",
      href: "https://arbitrum.threshold.network/loyalty-program",
      hideFromMenu: chainId !== SupportedChainIds.Arbitrum,
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
