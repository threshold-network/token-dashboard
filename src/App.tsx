import "focus-visible/dist/focus-visible"
import { FC } from "react"
import {
  Box,
  ChakraProvider,
  Container,
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
import Upgrade from "./pages/Upgrade"
import Staking from "./pages/Staking"
import { useSubscribeToERC20TransferEvent } from "./web3/hooks/useSubscribeToERC20TransferEvent"
import { useModal } from "./hooks/useModal"
import { useVendingMachineContract } from "./web3/hooks/useVendingMachineContract"
import { UpgredableToken } from "./types"
import { ModalType, Token } from "./enums"
import { useTStakingContract } from "./web3/hooks/useTStakingContract"

const Web3EventHandlerComponent = () => {
  useSubscribeToVendingMachineContractEvents()
  useSubscribeToERC20TransferEvent(Token.Keep)
  useSubscribeToERC20TransferEvent(Token.Nu)
  useSubscribeToERC20TransferEvent(Token.T)

  return <></>
}

// TODO: Let's move this to its own hook like useKeep, useT, etc
const useSubscribeToVendingMachineContractEvents = () => {
  const { account } = useWeb3React()
  const { openModal } = useModal()
  const keepVendingMachine = useVendingMachineContract(Token.Keep)
  const nuVendingMachine = useVendingMachineContract(Token.Nu)
  const tStaking = useTStakingContract()

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

  useSubscribeToContractEvent(
    tStaking,
    "OperatorStaked",
    // @ts-ignore
    (recipient, wrappedTokenAmount, tTokenAmount, event) => {
      console.log(
        "operator staked event",
        recipient,
        wrappedTokenAmount,
        tTokenAmount,
        event
      )
    },
    [account as string]
  )
}

const AppBody = () => {
  return (
    <Box display="flex">
      <Sidebar />
      <Box
        // 100% - 80px is to account for the sidebar
        w={{ base: "100%", md: "calc(100% - 80px)" }}
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
            <Route path="/staking">
              <Staking />
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
