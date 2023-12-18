import { createSelector } from "@reduxjs/toolkit"
import { RootState } from ".."
import { isAddressZero } from "../../web3/utils"
import { AccountState } from "./slice"

export const selectAccountState = (state: RootState) => state.account

export const selectMappedOperators = createSelector(
  [selectAccountState],
  (accountState: AccountState) => {
    const { randomBeacon, tbtc, taco } = accountState.operatorMapping.data
    const isOperatorMappedOnlyInTbtcForBundledRewards =
      !isAddressZero(tbtc) && isAddressZero(randomBeacon)
    const isOperatorMappedOnlyInRandomBeaconForBundledRewards =
      isAddressZero(tbtc) && !isAddressZero(randomBeacon)

    return {
      mappedOperatorTbtc: tbtc,
      mappedOperatorRandomBeacon: randomBeacon,
      mappedOperatorTaco: taco,
      isOperatorMappedOnlyInTbtcForBundledRewards,
      isOperatorMappedOnlyInRandomBeaconForBundledRewards,
      isOperatorMappedInAllApps:
        !isAddressZero(randomBeacon) &&
        !isAddressZero(tbtc) &&
        !isAddressZero(taco),
    }
  }
)
