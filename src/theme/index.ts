import { extendTheme, theme } from "@chakra-ui/react"
import { InfoBox } from "./InfoBox"

import { defaultTheme } from "@threshold-network/components"

const index = extendTheme({
  ...defaultTheme,
  components: {
    ...defaultTheme.components,
    InfoBox,
  },
})

export default index
