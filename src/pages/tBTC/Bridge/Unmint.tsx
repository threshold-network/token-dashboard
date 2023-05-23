import { PageComponent } from "../../../types"

export const UnmintPage: PageComponent = ({}) => {
  return <>Unmint Page</>
}

UnmintPage.route = {
  path: "unmint",
  index: false,
  title: "Unmint",
  isPageEnabled: true,
}
