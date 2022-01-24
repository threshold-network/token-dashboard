import UpgradeToken from "./UpgradeToken"
import { Token } from "../../enums"
import { PageComponent } from "../../types"

const UpgradeKEEP: PageComponent = (props) => (
  <UpgradeToken {...props} token={Token.Keep} />
)

UpgradeKEEP.route = {
  path: "keep",
  index: false,
  title: "KEEP to T",
}

export default UpgradeKEEP
