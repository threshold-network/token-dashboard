import { extendTheme, theme } from "@chakra-ui/react"
import { InfoBox } from "./InfoBox"
import { NotificationPill } from "./NotificationPill"
import { Tree } from "./Tree"
import { Tabs } from "./Tabs"
import { Badge } from "./Badge"

import { defaultTheme } from "@threshold-network/components"
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
  },
})

export default index
