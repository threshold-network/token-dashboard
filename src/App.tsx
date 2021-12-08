import "focus-visible/dist/focus-visible"
import { FC, useEffect, useState } from "react"
import { Box, ChakraProvider, Container } from "@chakra-ui/react"
import { Provider as ReduxProvider } from "react-redux"
import { Web3ReactProvider } from "@web3-react/core"
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useRouteMatch,
} from "react-router-dom"
import { TokenContextProvider } from "./contexts/TokenContext"
import theme from "./theme"
import reduxStore from "./store"
import ModalRoot from "./components/Modal"
import Sidebar from "./components/Sidebar"
import getLibrary from "./web3/library"
import Navbar from "./components/Navbar"
import Overview from "./pages/Overview"
import Upgrade from "./pages/Upgrade"
import Portfolio from "./pages/Portfolio"

const App: FC = () => {
  return (
    <Router basename={`${process.env.PUBLIC_URL}`}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ReduxProvider store={reduxStore}>
          <ChakraProvider theme={theme}>
            <TokenContextProvider>
              <ModalRoot />
              <Box display="flex">
                <Sidebar />
                <Box w="100%">
                  <Navbar />
                  <Container maxW="6xl" data-cy="app-container" pb={8}>
                    <Switch>
                      <Redirect from="/" to="/overview" exact />
                      <Route path="/overview" component={Overview} />
                      <Route path="/upgrade" component={Upgrade} />
                      <Route path="/portfolio" component={Portfolio} />
                    </Switch>
                  </Container>
                </Box>
              </Box>
            </TokenContextProvider>
          </ChakraProvider>
        </ReduxProvider>
      </Web3ReactProvider>
    </Router>
  )
}

export default App
