import { configureStore } from "@reduxjs/toolkit"
import { modalSlice } from "./modal"
import { tokenSlice } from "./tokens"
import { sidebarSlice } from "./sidebar"
import { transactionSlice } from "./transactions"
import { stakingSlice } from "./staking"
import { ethSlice } from "./eth"
import { rewardsSlice } from "./rewards"

const store = configureStore({
  reducer: {
    modal: modalSlice.reducer,
    token: tokenSlice.reducer,
    sidebar: sidebarSlice.reducer,
    transaction: transactionSlice.reducer,
    staking: stakingSlice.reducer,
    eth: ethSlice.reducer,
    rewards: rewardsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "modal/openModal",
          "staking/unstaked",
          "staking/updateStakeAmountForProvider",
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
    }),
})

export type RootState = ReturnType<typeof store.getState>

export default store
