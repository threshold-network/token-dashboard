import { Container } from "@chakra-ui/react"
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from "react-router-dom"
import { H1, Label1 } from "../../components/Typography"
import SubNavigationPills from "../../components/SubNavigationPills"
import Network from "./Network"
import tBTC from "./tBTC"
import Pre from "./Pre"

const Overview = ({}) => {
  const { pathname } = useLocation()

  const subNavLinks = [
    {
      text: "Network",
      href: "/network",
      isActive: pathname.includes("/network"),
    },
    { text: "tBTC", href: "/tBTC", isActive: pathname.includes("/tBTC") },
    { text: "PRE", href: "/pre", isActive: pathname.includes("/pre") },
  ]

  const { path } = useRouteMatch()

  return (
    <Container maxW="xxxl" mt={16}>
      <Label1>Threshold</Label1>
      <H1>Network Overview</H1>
      <SubNavigationPills links={subNavLinks} />

      <Redirect from="/overview" to="/overview/network" />
      <Route path={`${path}/network`} component={Network} />
      <Route path={`${path}/tBTC`} component={tBTC} />
      <Route path={`${path}/pre`} component={Pre} />
    </Container>
  )
}

export default Overview
