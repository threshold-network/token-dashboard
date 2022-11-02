import UpgradeKEEP from "./UpgradeKEEP"
import UpgradeNU from "./UpgradeNU"
import PageLayout from "../PageLayout"
import { PageComponent } from "../../types"

const UpgradePage: PageComponent = (props) => {
  return <PageLayout title={props.title} pages={props.pages} />
}

UpgradePage.route = {
  path: "upgrade",
  index: true,
  pages: [UpgradeKEEP, UpgradeNU],
  title: "Upgrade",
  isPageEnabled: true,
}

export default UpgradePage
