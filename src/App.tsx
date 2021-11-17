import { FC } from "react"
import { ChakraProvider, Container, Heading } from "@chakra-ui/react"
import { Provider as ReduxProvider } from "react-redux"
import { Web3ReactProvider } from "@web3-react/core"
import { BrowserRouter as Router } from "react-router-dom"
import { TokenContextProvider } from "./contexts/TokenContext"
import theme from "./theme"
import reduxStore from "./store"
import ModalRoot from "./components/Modal"
import getLibrary from "./web3/library"
import Navbar from "./components/Navbar"
import { ScratchPad } from "./components/ScratchPad"

const App: FC = () => {
  return (
    <Router basename={`${process.env.PUBLIC_URL}`}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ReduxProvider store={reduxStore}>
          <ChakraProvider theme={theme}>
            <TokenContextProvider>
              <ModalRoot />
              <Navbar />
              <Container maxW="6xl" data-cy="app-container">
                <Heading>Threshold Token Dashboard</Heading>
                <ScratchPad />
              </Container>
            </TokenContextProvider>
          </ChakraProvider>
        </ReduxProvider>
      </Web3ReactProvider>
    </Router>
  )
}

export default App
