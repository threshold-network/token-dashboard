import { useEffect } from "react"
import { Container } from "@chakra-ui/react"
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom"
import { H1, H3, Label1 } from "../../components/Typography"
import SubNavigationPills from "../../components/SubNavigationPills"
import Network from "./Network"
import TBTC from "./tBTC"
import Pre from "./Pre"
import useChakraBreakpoint from "../../hooks/useChakraBreakpoint"
import { useFetchTvl } from "../../hooks/useFetchTvl"

const subNavLinks = [
  {
    text: "Network",
    path: "/network",
  },
  { text: "tBTC", path: "/tBTC" },
  { text: "PRE", path: "/pre" },
]

const Overview = ({}) => {
  const { path } = useRouteMatch()
  const isMobile = useChakraBreakpoint("md")
  const [data, fetchtTvlData] = useFetchTvl()

  useEffect(() => {
    fetchtTvlData()
  }, [fetchtTvlData])

  return (
    <Container maxW={{ base: "2xl", xl: "6xl" }} mt={16}>
      <Label1>Threshold</Label1>
      {isMobile ? <H3>Network Overview</H3> : <H1>Network Overview</H1>}
      <SubNavigationPills parentPath={path} links={subNavLinks} />
      <Switch>
        <Route path={`${path}/network`}>
          <Network totalValueLocked={data.total} />
        </Route>
        <Route path={`${path}/tBTC`}>
          <TBTC />
        </Route>
        <Route path={`${path}/pre`}>
          <Pre />
        </Route>
        <Redirect from="/overview" to="/overview/network" />
      </Switch>
    </Container>
  )
}

export default Overview
