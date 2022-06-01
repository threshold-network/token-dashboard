import { PageComponent } from "../../types"
import PageLayout from "../PageLayout"

const TBTCBridge: PageComponent = (props) => {
  return <PageLayout {...props}>tbtc bridge!</PageLayout>
}

TBTCBridge.route = {
  path: "",
  index: false,
  title: "Bridge",
}

export default TBTCBridge
