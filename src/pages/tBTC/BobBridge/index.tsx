import TBTCBridge from "./TBTCBridge"
import PageLayout from "../../PageLayout"
import { PageComponent } from "../../../types"

const BridgePage: PageComponent = (props) => {
  return <PageLayout title={props.title} pages={props.pages} />
}

BridgePage.route = {
  path: "bridges",
  index: false,
  pages: [TBTCBridge],
  title: "Bridges",
  isPageEnabled: true,
}

export default BridgePage
