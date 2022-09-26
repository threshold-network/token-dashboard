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
import { stakingSlice } from "./staking"
import { ethSlice } from "./eth"
import { rewardsSlice } from "./rewards"
import { tbtcSlice } from "./tbtc"
import { stakingApplicationsSlice } from "./staking-applications/slice"
import { listenerMiddleware } from "./listener"
import { connectedAccountSlice } from "./connected-account"
import { modalQueueSlice } from "./modalQueue"

const combinedReducer = combineReducers({
  connectedAccount: connectedAccountSlice.reducer,
  modal: modalSlice.reducer,
  token: tokenSlice.reducer,
  sidebar: sidebarSlice.reducer,
  transaction: transactionSlice.reducer,
  staking: stakingSlice.reducer,
  eth: ethSlice.reducer,
  tbtc: tbtcSlice.reducer,
  rewards: rewardsSlice.reducer,
  applications: stakingApplicationsSlice.reducer,
  modalQueue: modalQueueSlice.reducer,
})

const APP_RESET_STORE = "app/reset_store"

export const resetStoreAction = () => ({
  type: APP_RESET_STORE,
})

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  if (action.type === APP_RESET_STORE) {
    state = {
      eth: { ...state.eth },
      token: {
        KEEP: { ...state.token.KEEP, balance: 0 },
        NU: { ...state.token.NU, balance: 0 },
        T: { ...state.token.T, balance: 0 },
        TBTC: { ...state.token.TBTC, balance: 0 },
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
