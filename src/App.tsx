import "focus-visible/dist/focus-visible"
import { FC, useEffect } from "react"
import { Box, ChakraProvider, useColorModeValue } from "@chakra-ui/react"
import { Provider as ReduxProvider, useDispatch } from "react-redux"
import { useWeb3React, Web3ReactProvider } from "@web3-react/core"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom"
import { BigNumberish } from "@ethersproject/bignumber"
import { Event } from "@ethersproject/contracts"
import { TokenContextProvider } from "./contexts/TokenContext"
import theme from "./theme"
import reduxStore from "./store"
import ModalRoot from "./components/Modal"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import { fetchETHPriceUSD } from "./store/eth"
import { UpgredableToken } from "./types"
import { ModalType, Token } from "./enums"
import getLibrary from "./web3/library"
import { useSubscribeToContractEvent } from "./web3/hooks/useSubscribeToContractEvent"
import { useSubscribeToERC20TransferEvent } from "./web3/hooks/useSubscribeToERC20TransferEvent"
import { useVendingMachineContract } from "./web3/hooks/useVendingMachineContract"
import { useModal } from "./hooks/useModal"
import { useSubscribeToOperatorStakedEvent } from "./hooks/useSubscribeToOperatorStakedEvent"
import { useSubscribeToUnstakedEvent } from "./hooks/useSubscribeToUnstakedEvent"
import Overview from "./pages/Overview"
import UpgradePage, { UpgradeTokenPage } from "./pages/Upgrade"
import Network from "./pages/Overview/Network"
import TBTCPage from "./pages/Overview/tBTC"
import Pre from "./pages/Overview/Pre"
import StakingPage from "./pages/Staking"

const Web3EventHandlerComponent = () => {
  useSubscribeToVendingMachineContractEvents()
  useSubscribeToERC20TransferEvent(Token.Keep)
  useSubscribeToERC20TransferEvent(Token.Nu)
  useSubscribeToERC20TransferEvent(Token.T)
  useSubscribeToOperatorStakedEvent()
  useSubscribeToUnstakedEvent()

  return <></>
}

// TODO: Let's move this to its own hook like useKeep, useT, etc
const useSubscribeToVendingMachineContractEvents = () => {
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
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchETHPriceUSD())
  }, [dispatch])

  return <Routing />
}

const Layout = () => {
  return (
    <Box display="flex">
      <Sidebar />
      <Box
        // 100% - 80px is to account for the sidebar
        w={{ base: "100%", md: "calc(100% - 80px)" }}
        bg={useColorModeValue("transparent", "gray.900")}
      >
        <Navbar />
        <Box as="main" data-cy="app-container">
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="overview" />} />
        <Route path="overview" element={<Overview />}>
          <Route index element={<Navigate to="network" />} />
          <Route path="network" element={<Network totalValueLocked="0" />} />
          <Route path="tbtc" element={<TBTCPage />} />
          <Route path="pre" element={<Pre />} />
        </Route>
        <Route path="upgrade" element={<UpgradePage />}>
          <Route index element={<Navigate to="keep" />} />
          <Route path=":token" element={<UpgradeTokenPage />} />
        </Route>
        <Route path="staking" element={<StakingPage />} />
      </Route>
    </Routes>
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
