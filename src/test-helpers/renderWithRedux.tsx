import React, { ReactElement } from "react"
import { render, RenderOptions } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore, PreloadedState } from "@reduxjs/toolkit"
import { ChakraProvider } from "@chakra-ui/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import theme from "../theme"

// Import the actual reducers
import { accountSlice } from "../store/account"
import { modalSlice } from "../store/modal"
import { sidebarSlice } from "../store/sidebar"
import { stakingSlice } from "../store/staking"
import { tbtcSlice } from "../store/tbtc"
import { tokenSlice } from "../store/tokens"
import { transactionSlice } from "../store/transactions"
import { rewardsSlice } from "../store/rewards"
import { stakingApplicationsSlice } from "../store/staking-applications"

// Define the root state type
export interface RootState {
  account: ReturnType<typeof accountSlice.reducer>
  modal: ReturnType<typeof modalSlice.reducer>
  sidebar: ReturnType<typeof sidebarSlice.reducer>
  staking: ReturnType<typeof stakingSlice.reducer>
  tbtc: ReturnType<typeof tbtcSlice.reducer>
  tokens: ReturnType<typeof tokenSlice.reducer>
  transactions: ReturnType<typeof transactionSlice.reducer>
  rewards: ReturnType<typeof rewardsSlice.reducer>
  stakingApplications: ReturnType<typeof stakingApplicationsSlice.reducer>
}

// Create default preloaded state
const defaultPreloadedState: PreloadedState<RootState> = {
  account: {
    address: "0xtest",
    chainId: 1,
    isStakingProvider: false,
    isBlocked: false,
    operatorMapping: {
      data: {
        tbtc: "0x0000000000000000000000000000000000000000",
        randomBeacon: "0x0000000000000000000000000000000000000000",
        taco: "0x0000000000000000000000000000000000000000",
      },
      isFetching: false,
      isInitialFetchDone: false,
      error: "",
    },
    trm: { isFetching: false, hasFetched: false, error: "" },
  },
  modal: {
    modalType: null,
    props: {},
    modalQueue: {
      isSuccessfulLoginModalClosed: false,
      isMappingOperatorToStakingProviderModalClosed: false,
    },
  },
  sidebar: {
    isOpen: false,
  },
  staking: {} as any,
  tbtc: {} as any,
  tokens: {} as any,
  transactions: {} as any,
  rewards: {} as any,
  stakingApplications: {} as any,
}

interface RenderWithReduxOptions extends Omit<RenderOptions, "wrapper"> {
  preloadedState?: PreloadedState<RootState>
  initialEntries?: string[]
  initialIndex?: number
  route?: string
  path?: string
}

export function renderWithRedux(
  ui: ReactElement,
  {
    preloadedState = defaultPreloadedState,
    initialEntries = ["/"],
    initialIndex = 0,
    route = "*",
    path = "*",
    ...renderOptions
  }: RenderWithReduxOptions = {}
) {
  const store = configureStore({
    reducer: {
      account: accountSlice.reducer,
      modal: modalSlice.reducer,
      sidebar: sidebarSlice.reducer,
      staking: stakingSlice.reducer,
      tbtc: tbtcSlice.reducer,
      tokens: tokenSlice.reducer,
      transactions: transactionSlice.reducer,
      rewards: rewardsSlice.reducer,
      stakingApplications: stakingApplicationsSlice.reducer,
    },
    preloadedState,
  })

  function Wrapper({ children }: { children?: React.ReactNode }) {
    return (
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <MemoryRouter
            initialEntries={initialEntries}
            initialIndex={initialIndex}
          >
            <Routes>
              <Route path={path} element={<>{children}</>} />
            </Routes>
          </MemoryRouter>
        </ChakraProvider>
      </Provider>
    )
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}

// Re-export everything from @testing-library/react
export * from "@testing-library/react"
