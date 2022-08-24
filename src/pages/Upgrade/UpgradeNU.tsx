import UpgradeToken from "./UpgradeToken"
import { Token } from "../../enums"
import { PageComponent } from "../../types"

const UpgradeNU: PageComponent = (props) => {
  return <UpgradeToken {...props} token={Token.Nu} />
}

UpgradeNU.route = {
  path: "nu",
  index: true,
  title: "NU to T",
  isPageEnabled: true,
}

export default UpgradeNU
