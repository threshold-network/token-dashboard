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
import TBTC from "./tBTC"
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
      <Route path={`${path}/network`}>
        <Network />
      </Route>
      <Route path={`${path}/tBTC`}>
        <TBTC />
      </Route>
      <Route path={`${path}/pre`}>
        <Pre />
      </Route>
    </Container>
  )
}

export default Overview
