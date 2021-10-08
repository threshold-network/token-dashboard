import { FC } from "react"
import { ChakraProvider, Container, Heading } from "@chakra-ui/react"
import { Provider as ReduxProvider } from "react-redux"
import theme from "./theme"
import reduxStore from "./store"
import ModalRoot from "./components/Modal"

const App: FC = () => {
  return (
    <ReduxProvider store={reduxStore}>
      <ChakraProvider theme={theme}>
        <ModalRoot />
        <Container data-cy="app-container">
          <Heading>Threshold Token Dashboard?</Heading>
        </Container>
      </ChakraProvider>
    </ReduxProvider>
  )
}

export default App
