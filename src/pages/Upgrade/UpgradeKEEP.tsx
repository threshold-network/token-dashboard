import UpgradeToken from "./UpgradeToken"
import { Token } from "../../enums"
import { PageComponent } from "../../types"
import { useKeep } from "../../web3/hooks"

const UpgradeKEEP: PageComponent = (props) => {
  const keep = useKeep()
  return (
    <UpgradeToken {...props} token={Token.Keep} contract={keep?.contract} />
  )
}

UpgradeKEEP.route = {
  path: "keep",
  index: false,
  title: "KEEP to T",
}

export default UpgradeKEEP
