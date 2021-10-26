import { FC } from "react"
import { ChakraProvider, Container, Heading, HStack } from "@chakra-ui/react"
import { Provider as ReduxProvider } from "react-redux"
import { Web3ReactProvider } from "@web3-react/core"
import { TokenContextProvider } from "./contexts/TokenContext"
import theme from "./theme"
import reduxStore from "./store"
import ModalRoot from "./components/Modal"
import getLibrary from "./web3/library"
import Navbar from "./components/Navbar"
import { ScratchPad } from "./components/ScratchPad"

const App: FC = () => {
  return (
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
  )
}

export default App
