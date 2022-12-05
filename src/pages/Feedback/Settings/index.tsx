import React from "react"
import { Box } from "@threshold-network/components"
import { PageComponent } from "../../../types"

const Settings: PageComponent = () => {
  return <Box>settings page</Box>
}

Settings.route = {
  path: "settings",
  title: "Settings",
  index: false,
  isPageEnabled: true,
}

export default Settings
