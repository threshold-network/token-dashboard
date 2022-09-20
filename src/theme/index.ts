import { extendTheme } from "@chakra-ui/react"
import { defaultTheme } from "@threshold-network/components"
import { InfoBox } from "./InfoBox"
import { NotificationPill } from "./NotificationPill"
import { Tree } from "./Tree"
import { Tabs } from "./Tabs"
import { Badge } from "./Badge"
import { DetailedLinkListItem } from "./DetailedLinkListItem"
import { Checkbox } from "./Checkbox"
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
    DetailedLinkListItem,
    Radio,
    Checkbox,
  },
})

export default index
