import {
  configureStore,
  combineReducers,
  AnyAction,
  Reducer,
} from "@reduxjs/toolkit"
import { modalSlice } from "./modal"
import { tokenSlice } from "./tokens"
import { sidebarSlice } from "./sidebar"
import { transactionSlice } from "./transactions"
import { registerStakingListeners, stakingSlice } from "./staking"
import { ethSlice } from "./eth"
import { rewardsSlice } from "./rewards"
import { tbtcSlice, registerTBTCListeners } from "./tbtc"
import {
  registerStakingAppsListeners,
  stakingApplicationsSlice,
} from "./staking-applications/slice"
import { listenerMiddleware } from "./listener"
import { accountSlice, registerAccountListeners } from "./account"

const combinedReducer = combineReducers({
  account: accountSlice.reducer,
  modal: modalSlice.reducer,
  token: tokenSlice.reducer,
  sidebar: sidebarSlice.reducer,
  transaction: transactionSlice.reducer,
  staking: stakingSlice.reducer,
  eth: ethSlice.reducer,
  tbtc: tbtcSlice.reducer,
  rewards: rewardsSlice.reducer,
  applications: stakingApplicationsSlice.reducer,
})

const APP_RESET_STORE = "app/reset_store"

export const resetStoreAction = () => ({
  type: APP_RESET_STORE,
})

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  if (action.type === APP_RESET_STORE) {
    listenerMiddleware.clearListeners()
    registerStakingListeners()
    registerStakingAppsListeners()
    registerAccountListeners()
    registerTBTCListeners()
    state = {
      eth: { ...state.eth },
      token: {
        KEEP: { ...state.token.KEEP, balance: 0 },
        NU: { ...state.token.NU, balance: 0 },
        T: { ...state.token.T, balance: 0 },
        TBTC: { ...state.token.TBTC, balance: 0 },
        TBTCV2: { ...state.token.TBTCV2, balance: 0 },
      },
      // we don't display successful login modal when changin account so we are
      // setting the isSuccessfulLoginModalClosed flag to true and also
      // isMappingOperatorToStakingProviderModalClosed flag back to false
      modal: {
        modalQueue: {
          isSuccessfulLoginModalClosed: true,
          isMappingOperatorToStakingProviderModalClosed: false,
        },
      },
    } as RootState
  }

  return combinedReducer(state, action)
}

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "modal/openModal",
          "staking/unstaked",
          "staking/toppepUp",
        ],
        // Ignore these field paths in all actions
        ignoredPaths: [
          "staking.stakedBalance",
          "modal.props.setStakingProvider",
          "modal.props.setBeneficiary",
          "modal.props.setAuthorizer",
          "modal.props.onSubmit",
          "modal.props.setAmountToStake",
          "payload.props.setAmountToStake",
        ],
      },
    }).prepend(listenerMiddleware.middleware),
})

export type RootState = ReturnType<
  typeof store.getState & typeof combinedReducer
>
export type AppDispatch = typeof store.dispatch
export default store
