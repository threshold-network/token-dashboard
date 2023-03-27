import { PageComponent } from "../../../types"
import { UnmintingCard } from "./UnmintingCard"

export const UnmintPage: PageComponent = ({}) => {
  return <UnmintingCard gridArea="main-card" p={35} />
}

UnmintPage.route = {
  path: "unmint",
  index: false,
  title: "Unmint",
  isPageEnabled: true,
}
