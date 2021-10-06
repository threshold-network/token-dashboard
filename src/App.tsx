import { FC } from "react"
import {
  Alert,
  Button,
  ChakraProvider,
  Container,
  Heading,
} from "@chakra-ui/react"
import { Provider as ReduxProvider } from "react-redux"
import { useWeb3React, Web3ReactProvider } from "@web3-react/core"
import theme from "./theme"
import reduxStore from "./store"
import ModalRoot from "./components/Modal"
import getLibrary from "./web3/library"
import { ModalType } from "./enums"
import { useModal } from "./hooks/useModal"

const ModalButton = () => {
  const { openModal } = useModal()
  const { active, account } = useWeb3React()

  return (
    <>
      <Button onClick={() => openModal(ModalType.SelectWallet)}>
        Open Modal
      </Button>
      <Alert mt={6}>
        {active ? `You are connected to ${account}` : "You are not connected"}
      </Alert>
    </>
  )
}

const App: FC = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ReduxProvider store={reduxStore}>
        <ChakraProvider theme={theme}>
          <ModalRoot />
          <Container>
            <Heading>Threshold Token Dashboard?</Heading>
            <ModalButton />
          </Container>
        </ChakraProvider>
      </ReduxProvider>
    </Web3ReactProvider>
  )
}

export default App
