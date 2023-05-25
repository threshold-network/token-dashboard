import { useParams } from "react-router-dom"
import { Card } from "@threshold-network/components"
import { PageComponent } from "../../../types"

export const UnmintDetails: PageComponent = () => {
  const { redemptionKey } = useParams()

  return <Card>Redemption details page- redemption key: {redemptionKey}</Card>
}

UnmintDetails.route = {
  path: "redemption/:redemptionKey",
  index: false,
  isPageEnabled: true,
}
