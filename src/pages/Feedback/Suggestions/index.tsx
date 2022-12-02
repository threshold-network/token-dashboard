import React from "react"
import { Box } from "@threshold-network/components"
import { PageComponent } from "../../../types"

const Suggestions: PageComponent = () => {
  return <Box>suggestions page</Box>
}

Suggestions.route = {
  path: "suggestions",
  title: "Suggestions",
  index: false,
  isPageEnabled: true,
}

export default Suggestions
