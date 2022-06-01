import PageLayout from "../PageLayout"
import { PageComponent } from "../../types"

const TBTCPage: PageComponent = (props) => {
  return <PageLayout {...props}>tbtc page!</PageLayout>
}

TBTCPage.route = {
  path: "",
  index: false,
  title: "TBTC",
}

const MainTBTCPage: PageComponent = (props) => {
  return <PageLayout {...props} />
}

MainTBTCPage.route = {
  path: "tBTC",
  index: true,
  pages: [TBTCPage],
  title: "TBTC",
}

export default MainTBTCPage
