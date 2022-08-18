import { extendTheme } from "@chakra-ui/react"
import { InfoBox } from "./InfoBox"
import { NotificationPill } from "./NotificationPill"
import { Tree } from "./Tree"
import { Tabs } from "./Tabs"
import { Badge } from "./Badge"
import { Checkbox } from "./Checkbox"

import { defaultTheme } from "@threshold-network/components"

const index = extendTheme({
  ...defaultTheme,
  components: {
    ...defaultTheme.components,
    InfoBox,
    NotificationPill,
    Tree,
    Tabs,
    Badge,
    Checkbox,
  },
})

export default index
