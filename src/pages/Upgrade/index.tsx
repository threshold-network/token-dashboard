import UpgradeKEEP from "./UpgradeKEEP"
import UpgradeNU from "./UpgradeNU"
import PageLayout from "../PageLayout"
import { PageComponent } from "../../types"

const UpgradePage: PageComponent = (props) => {
  return <PageLayout {...props} />
}

UpgradePage.route = {
  path: "upgrade",
  index: true,
  pages: [UpgradeKEEP, UpgradeNU],
  title: "Upgrade",
}

export default UpgradePage
