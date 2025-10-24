import TBTCBridge from "./TBTCBridge"
import { PageComponent } from "../../../types"

const BridgePage: PageComponent = () => {
  // Render the actual bridge page directly to avoid nested PageLayout footers
  return <TBTCBridge />
}

BridgePage.route = {
  path: "bridges",
  index: false,
  pages: [],
  title: "Bridges",
  isPageEnabled: true,
}

export default BridgePage
