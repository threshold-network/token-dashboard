import { FC } from "react"
import { Router } from "react-router-dom"
import { createBrowserHistory } from "history"
import { ChakraProvider, Box, ColorModeScript } from "@chakra-ui/react"
import theme from "./theme"
import SideNav from "./components/SideNav"
import Routes from "./Routes"

const history = createBrowserHistory()

const App: FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <Router history={history}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <SideNav />
        <Box position="absolute" left="200px">
          <Routes />
        </Box>
      </Router>
    </ChakraProvider>
  )
}

export default App
