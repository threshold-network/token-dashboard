import { FC } from "react"
import { ChakraProvider, Container, Heading } from "@chakra-ui/react"
import { Provider as ReduxProvider } from "react-redux"
import { BrowserRouter as Router } from "react-router-dom"
import theme from "./theme"
import reduxStore from "./store"
import ModalRoot from "./components/Modal"

const App: FC = () => {
  return (
    <Router basename={`${process.env.PUBLIC_URL}`}>
      <ReduxProvider store={reduxStore}>
        <ChakraProvider theme={theme}>
          <ModalRoot />
          <Container data-cy="app-container">
            <Heading>Threshold Token Dashboard?</Heading>
          </Container>
        </ChakraProvider>
      </ReduxProvider>
    </Router>
  )
}

export default App
