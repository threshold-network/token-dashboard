import React from "react"
import { Box } from "@threshold-network/components"
import { PageComponent } from "../../../types"

const BugReport: PageComponent = () => {
  return <Box>bug report page</Box>
}

BugReport.route = {
  path: "bug-report",
  title: "Bug Report",
  index: false,
  isPageEnabled: true,
}

export default BugReport
