import UpgradeToken from "./UpgradeToken"
import { Token } from "../../enums"
import { PageComponent } from "../../types"
import { useNu } from "../../web3/hooks"

const UpgradeNU: PageComponent = (props) => {
  const nu = useNu()
  return <UpgradeToken {...props} token={Token.Nu} contract={nu?.contract} />
}

UpgradeNU.route = {
  path: "nu",
  index: true,
  title: "NU to T",
}

export default UpgradeNU
