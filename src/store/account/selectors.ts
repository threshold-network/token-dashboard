import { createSelector } from "@reduxjs/toolkit"
import { RootState } from ".."
import { isAddressZero } from "../../web3/utils"
import { AccountState } from "./slice"

export const selectAccountState = (state: RootState) => state.account

export const selectMappedOperators = createSelector(
  [selectAccountState],
  (accountState: AccountState) => {
    const { randomBeacon, tbtc } = accountState.operatorMapping.data
    const isOperatorMappedOnlyInTbtc =
      !isAddressZero(tbtc) && isAddressZero(randomBeacon)
    const isOperatorMappedOnlyInRandomBeacon =
      isAddressZero(tbtc) && !isAddressZero(randomBeacon)

    return {
      mappedOperatorTbtc: tbtc,
      mappedOperatorRandomBeacon: randomBeacon,
      isOperatorMappedOnlyInTbtc,
      isOperatorMappedOnlyInRandomBeacon,
      isOneOfTheAppsNotMapped:
        isOperatorMappedOnlyInRandomBeacon || isOperatorMappedOnlyInTbtc,
      isOperatorMappedInBothApps:
        !isAddressZero(randomBeacon) && !isAddressZero(tbtc),
    }
  }
)
