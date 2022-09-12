import { extendTheme } from "@chakra-ui/react"
import { defaultTheme } from "@threshold-network/components"
import { InfoBox } from "./InfoBox"
import { NotificationPill } from "./NotificationPill"
import { Tree } from "./Tree"
import { Tabs } from "./Tabs"
import { Badge } from "./Badge"
import { Checkbox } from "./Checkbox"
import { DetailedLinkListItem } from "./DetailedLinkListItem"
import { Radio } from "./Radio"

const index = extendTheme({
  ...defaultTheme,
  components: {
    ...defaultTheme.components,
    InfoBox,
    NotificationPill,
    Tree,
    Tabs,
    Badge,
    Radio,
    Checkbox,
    DetailedLinkListItem,
  },
})

export default index
