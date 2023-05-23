import { PageComponent } from "../../../types"
import {
  BridgeLayout,
  BridgeLayoutAsideSection,
  BridgeLayoutMainSection,
} from "./BridgeLayout"

export const UnmintPage: PageComponent = ({}) => {
  return (
    <BridgeLayout>
      <BridgeLayoutMainSection>Unmint form here</BridgeLayoutMainSection>
      <BridgeLayoutAsideSection>
        Bridge timeline and durations
      </BridgeLayoutAsideSection>
    </BridgeLayout>
  )
}

UnmintPage.route = {
  path: "unmint",
  index: false,
  title: "Unmint",
  isPageEnabled: true,
}
