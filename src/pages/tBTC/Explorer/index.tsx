import { PageComponent } from "../../../types"

export const ExplorerPage: PageComponent = () => {
  return <>Explorer Page</>
}

ExplorerPage.route = {
  title: "tBTC Explorer",
  path: "explorer",
  index: false,
  isPageEnabled: true,
}
