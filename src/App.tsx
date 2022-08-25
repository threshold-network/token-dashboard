import "focus-visible/dist/focus-visible"
import "@fontsource/inter/700.css"
import "@fontsource/inter/600.css"
import "@fontsource/inter/500.css"
import "@fontsource/inter/400.css"
import { FC, useEffect, Fragment, useContext } from "react"
import { Box, ChakraProvider, useColorModeValue } from "@chakra-ui/react"
import { Provider as ReduxProvider, useDispatch } from "react-redux"
import { useWeb3React, Web3ReactProvider } from "@web3-react/core"
import { ConnectorEvent, ConnectorUpdate } from "@web3-react/types"
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
import reduxStore, { resetStoreAction } from "./store"
import ModalRoot from "./components/Modal"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import { fetchETHPriceUSD } from "./store/eth"
import { PageComponent, UpgredableToken } from "./types"
import { ModalType, Token } from "./enums"
import getLibrary from "./web3/library"
import { useSubscribeToContractEvent } from "./web3/hooks/useSubscribeToContractEvent"
import { useSubscribeToERC20TransferEvent } from "./web3/hooks/useSubscribeToERC20TransferEvent"
import { useVendingMachineContract } from "./web3/hooks/useVendingMachineContract"
import { useModal } from "./hooks/useModal"
import { useSubscribeToStakedEvent } from "./hooks/useSubscribeToStakedEvent"
import { useSubscribeToUnstakedEvent } from "./hooks/useSubscribeToUnstakedEvent"
import { useSubscribeToToppedUpEvent } from "./hooks/useSubscribeToToppedUpEvent"
import { pages } from "./pages"
import { useCheckBonusEligibility } from "./hooks/useCheckBonusEligibility"
import { useFetchStakingRewards } from "./hooks/useFetchStakingRewards"
import { isSameETHAddress } from "./web3/utils"

const Web3EventHandlerComponent = () => {
  useSubscribeToVendingMachineContractEvents()
  useSubscribeToERC20TransferEvent(Token.Keep)
  useSubscribeToERC20TransferEvent(Token.Nu)
  useSubscribeToERC20TransferEvent(Token.T)
  useSubscribeToStakedEvent()
  useSubscribeToUnstakedEvent()
  useSubscribeToToppedUpEvent()

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
  const { connector, account } = useWeb3React()

  useEffect(() => {
    const updateHandler = (update: ConnectorUpdate) => {
      if (
        !update.account ||
        !isSameETHAddress(update.account, account as string)
      )
        dispatch(resetStoreAction())
    }

    const deactivateHandler = () => {
      dispatch(resetStoreAction())
    }

    connector?.on(ConnectorEvent.Update, updateHandler)
    connector?.on(ConnectorEvent.Deactivate, deactivateHandler)
    return () => {
      connector?.removeListener(ConnectorEvent.Update, updateHandler)
      connector?.removeListener(ConnectorEvent.Deactivate, deactivateHandler)
    }
  }, [connector, dispatch, account])

  useEffect(() => {
    dispatch(fetchETHPriceUSD())
  }, [dispatch])

  useCheckBonusEligibility()
  useFetchStakingRewards()

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
      <Route path="*" element={<Layout />}>
        <Route index element={<Navigate to="overview" />} />
        {pages.map((page: PageComponent) => {
          if (!page.route.isPageEnabled) return null
          return renderPageComponent(page)
        })}
        <Route path="*" element={<Navigate to="overview" />} />
      </Route>
    </Routes>
  )
}

const renderPageComponent = (PageComponent: PageComponent) => {
  return (
    <Fragment key={PageComponent.route.path}>
      {PageComponent.route.index && (
        <Route
          index
          element={<Navigate to={PageComponent.route.path} replace />}
        />
      )}
      <Route
        path={PageComponent.route.path}
        element={<PageComponent {...PageComponent.route} />}
      >
        {PageComponent.route.pages?.map((page) => {
          if (!page.route.isPageEnabled) return null
          return renderPageComponent(page)
        })}
      </Route>
    </Fragment>
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
