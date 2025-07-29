import UpgradeKEEP from "./UpgradeKEEP"
import UpgradeNU from "./UpgradeNU"
import PageLayout from "../PageLayout"
import { PageComponent } from "../../types"

const BridgePage: PageComponent = (props) => {
  return <PageLayout title={props.title} pages={props.pages} />
}

BridgePage.route = {
  path: "bridge",
  index: true,
  pages: [UpgradeKEEP, UpgradeNU],
  title: "Bridge",
  isPageEnabled: true,
}

export default BridgePage
