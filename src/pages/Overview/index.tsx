import { Container } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"
import { H1, H3, Label1 } from "../../components/Typography"
import useChakraBreakpoint from "../../hooks/useChakraBreakpoint"
import useDocumentTitle from "../../hooks/useDocumentTitle"
import Network from "./Network"
import { PageComponent } from "../../types"

const Overview: PageComponent = ({ pages }) => {
  useDocumentTitle("Threshold - Overview")
  const isMobile = useChakraBreakpoint("md")

  return (
    <Container maxW={{ base: "2xl", xl: "6xl" }} my={16}>
      <Label1>Threshold</Label1>
      {isMobile ? <H3>Network Overview</H3> : <H1>Network Overview</H1>}
      <Outlet />
    </Container>
  )
}

Overview.route = {
  path: "overview",
  index: false,
  pages: [Network],
}

export default Overview
