import { Switch, Route } from "react-router-dom"
import Overview from "./pages/Overview"
import Balances from "./pages/Balances"
import Upgrade from "./pages/Upgrade"
import { Box, useColorModeValue } from "@chakra-ui/react"

const Routes = () => {
  return (
    <Box
      position="fixed"
      left="200px"
      w="calc(100% - 200px)"
      h="100%"
      bg={useColorModeValue("gray.100", "gray.800")}
    >
      <Switch>
        <Route path="/overview" component={Overview} />
        <Route path="/upgrade" component={Upgrade} />
        <Route path="/balances" component={Balances} />
      </Switch>
    </Box>
  )
}

export default Routes
