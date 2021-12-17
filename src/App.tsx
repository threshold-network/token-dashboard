import "focus-visible/dist/focus-visible"
import { FC } from "react"
import {
  Box,
  ChakraProvider,
  Container,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react"
import { Provider as ReduxProvider } from "react-redux"
import { useWeb3React, Web3ReactProvider } from "@web3-react/core"
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom"
import { BigNumberish } from "@ethersproject/bignumber"
import { Event } from "@ethersproject/contracts"
import { TokenContextProvider } from "./contexts/TokenContext"
import theme from "./theme"
import reduxStore from "./store"
import ModalRoot from "./components/Modal"
import Sidebar from "./components/Sidebar"
import getLibrary from "./web3/library"
import Navbar from "./components/Navbar"
import Overview from "./pages/Overview"
import { useSubscribeToContractEvent } from "./web3/hooks/useSubscribeToContractEvent"
// import VendingMachineKeep from "@threshold-network/solidity-contracts/artifacts/VendingMachineKeep.json"
import Upgrade from "./pages/Upgrade"
import Portfolio from "./pages/Portfolio"
import { useSubscribeToERC20TransferEvent } from "./web3/hooks/useSubscribeToERC20TransferEvent"
import { useModal } from "./hooks/useModal"
import { useVendingMachineContract } from "./web3/hooks/useVendingMachineContract"
import { UpgredableToken } from "./types"
import { ModalType, Token } from "./enums"
import { useContract } from "./web3/hooks/useContract"

const Web3EventHandlerComponent = () => {
  useSubscribeToVendingMachineContractEvents()
  useSubscribeToERC20TransferEvent(Token.Keep)
  useSubscribeToERC20TransferEvent(Token.Nu)
  useSubscribeToERC20TransferEvent(Token.T)

  return <></>
}

const useSubscribeToVendingMachineContractEvents = () => {
  // TODO: can we use useVendingMachineContract here?
  const contract = useContract(
    // VendingMachineKeep.address,
    // random hardcoded address to avoid local deployment:
    "0x71d82Eb6A5051CfF99582F4CDf2aE9cD402A4883",
    // VendingMachineKeep.abi
    undefined
  )

  const { account } = useWeb3React()
  const { openModal } = useModal()
  const keepVendingMachine = useVendingMachineContract(Token.Keep)
  const nuVendingMachine = useVendingMachineContract(Token.Nu)

  const onEvent = (
    token: UpgredableToken,
    wrappedTokenAmount: BigNumberish,
    tTokenAmount: BigNumberish,
    event: Event
  ) => {
    openModal(ModalType.UpgradedToT, {
      upgradedAmount: wrappedTokenAmount.toString(),
      receivedAmount: tTokenAmount.toString(),
      transactionHash: event.transactionHash,
      token,
    })
  }

  useSubscribeToContractEvent(
    keepVendingMachine,
    "Wrapped",
    // @ts-ignore
    (recipient, wrappedTokenAmount, tTokenAmount, event) => {
      onEvent(Token.Keep, wrappedTokenAmount, tTokenAmount, event)
    },
    [account as string]
  )
  useSubscribeToContractEvent(
    nuVendingMachine,
    "Wrapped",
    // @ts-ignore
    (recipient, wrappedTokenAmount, tTokenAmount, event) => {
      onEvent(Token.Nu, wrappedTokenAmount, tTokenAmount, event)
    },
    [account as string]
  )
}

const AppBody = () => {
  return (
    <Box display="flex">
      <Sidebar />
      <Box
        w={{ base: "100%", sm: "calc(100% - 80px)" }}
        bg={useColorModeValue("transparent", "gray.900")}
      >
        <Navbar />
        <Container as="main" mt="12" maxW="6xl" data-cy="app-container" pb={8}>
          <Switch>
            <Redirect from="/" to="/overview" exact />
            <Route path="/overview">
              <Overview />
            </Route>
            <Route path="/upgrade/:token">
              <Upgrade />
            </Route>
            <Route path="/upgrade">
              <Redirect to="/upgrade/keep" />
            </Route>
            <Route path="/portfolio">
              <Portfolio />
            </Route>
          </Switch>
        </Container>
      </Box>
    </Box>
  )
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
              <AppBody />
            </TokenContextProvider>
          </ChakraProvider>
        </ReduxProvider>
      </Web3ReactProvider>
    </Router>
  )
}

export default App
