import { createSelector } from "@reduxjs/toolkit"
import { RootState } from ".."
import { isAddressZero } from "../../web3/utils"
import { AccountState } from "./slice"

export const selectAccountState = (state: RootState) => state.account

export const selectMappedOperatorsAndAdditionalData = createSelector(
  [selectAccountState],
  (accountState: AccountState) => {
    const { randomBeacon, tbtc } = accountState.operatorMapping.data
    return {
      mappedOperatorTbtc: tbtc,
      mappedOperatorRandomBeacon: randomBeacon,
      isOperatorMappedOnlyInTbtc:
        !isAddressZero(tbtc) && isAddressZero(randomBeacon),
      isOperatorMappedOnlyInRandomBeacon:
        isAddressZero(tbtc) && !isAddressZero(randomBeacon),
      isOperatorMappedInBothApps:
        !isAddressZero(randomBeacon) && !isAddressZero(tbtc),
    }
  }
)
