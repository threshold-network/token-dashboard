import { FC } from "react"
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react"
import { Router } from "react-router-dom"
import { createBrowserHistory } from "history"
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
        <Routes />
      </Router>
    </ChakraProvider>
  )
}

export default App
