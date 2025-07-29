import TBTCBridge from "./TBTCBridge"
import PageLayout from "../PageLayout"
import { PageComponent } from "../../types"

const BridgePage: PageComponent = (props) => {
  return <PageLayout title={props.title} pages={props.pages} />
}

BridgePage.route = {
  path: "bridge",
  index: true,
  pages: [TBTCBridge],
  title: "Bridge",
  isPageEnabled: true,
}

export default BridgePage
