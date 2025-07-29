import UpgradeToken from "./UpgradeToken"
import { Token } from "../../enums"
import { PageComponent } from "../../types"
import { useKeep } from "../../web3/hooks"

const UpgradeKEEP: PageComponent = (props) => {
  return <UpgradeToken {...props} token={Token.Keep} />
}

UpgradeKEEP.route = {
  path: "keep",
  index: false,
  title: "KEEP to T",
  isPageEnabled: true,
}

export default UpgradeKEEP
