import "focus-visible/dist/focus-visible"
import { FC } from "react"
import { Box, ChakraProvider, Container } from "@chakra-ui/react"
import { Provider as ReduxProvider } from "react-redux"
import { Web3ReactProvider } from "@web3-react/core"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { TokenContextProvider } from "./contexts/TokenContext"
import theme from "./theme"
import reduxStore from "./store"
import ModalRoot from "./components/Modal"
import Sidebar from "./components/Sidebar"
import getLibrary from "./web3/library"
import Navbar from "./components/Navbar"
import Upgrade from "./pages/Upgrade"
import Portfolio from "./pages/Portfolio"
import { useSubscribeToContractEvent } from "./web3/hooks/useSubscribeToContractEvent"
import { useContract } from "./web3/hooks/useContract"
import VendingMachineKeep from "@threshold-network/solidity-contracts/artifacts/VendingMachineKeep.json"
import { useSubscribeToERC20TransferEvent } from "./web3/hooks/useSubscribeToERC20TransferEvent"
import { Token } from "./enums"

const Web3EventHandlerComponent = () => {
  useSubscribeToVendingMachineContractEvents()
  useSubscribeToERC20TransferEvent(Token.Keep)
  useSubscribeToERC20TransferEvent(Token.Nu)

  return <></>
}

const useSubscribeToVendingMachineContractEvents = () => {
  const contract = useContract(
    VendingMachineKeep.address,
    VendingMachineKeep.abi
  )

  useSubscribeToContractEvent(contract, "Wrapped", (...args) => {
    console.log("Recived VendingMachineKeep.Wrapped event", args)
    // TODO dispatch action that opens the correct success modal.
  })
}

const App: FC = () => {
  return (
    <Router basename={`${process.env.PUBLIC_URL}`}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ReduxProvider store={reduxStore}>
          <ChakraProvider theme={theme}>
            <TokenContextProvider>
              <Web3EventHandlerComponent />
              <ModalRoot />
              <Box display="flex">
                <Sidebar />
                <Box w="100%">
                  <Navbar />
                  <Container maxW="6xl" data-cy="app-container">
                    <Switch>
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
