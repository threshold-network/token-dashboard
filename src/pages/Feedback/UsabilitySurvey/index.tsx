import React from "react"
import { Box } from "@chakra-ui/react"
import { PageComponent } from "../../../types"

const UsabilitySurvey: PageComponent = () => {
  return <Box>Usability survey page</Box>
}

UsabilitySurvey.route = {
  path: "usability-survey",
  title: "Usability Survey",
  index: false,
  isPageEnabled: true,
}

export default UsabilitySurvey
