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
import { ModalType, useModal } from "./store/modal"
import getLibrary from "./web3/library"

const ModalButton = () => {
  const { openModal } = useModal()
  const { active, account, error } = useWeb3React()

  console.log("-----------")
  console.log("active ", active)
  console.log("account ", account)
  console.log("error ", error)

  return (
    <>
      <Button onClick={() => openModal(ModalType.selectWallet)}>
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
