import { createSelector } from "@reduxjs/toolkit"
import { RootState } from ".."
import { isAddressZero } from "../../web3/utils"
import { AccountState } from "./slice"

export const selectAccountState = (state: RootState) => state.account

export const selectMappedOperators = createSelector(
  [selectAccountState],
  (accountState: AccountState) => {
    const { randomBeacon, tbtc, taco } = accountState.operatorMapping.data
    const isOperatorMappedOnlyInTbtc =
      !isAddressZero(tbtc) && isAddressZero(randomBeacon) && isAddressZero(taco)
    const isOperatorMappedOnlyInRandomBeacon =
      isAddressZero(tbtc) && !isAddressZero(randomBeacon) && isAddressZero(taco)
    const isOperatorMappedOnlyInTaco =
      isAddressZero(tbtc) && isAddressZero(randomBeacon) && !isAddressZero(taco)

    return {
      mappedOperatorTbtc: tbtc,
      mappedOperatorRandomBeacon: randomBeacon,
      mappedOperatorTaco: taco,
      isOperatorMappedOnlyInTbtc,
      isOperatorMappedOnlyInRandomBeacon,
      isOperatorMappedOnlyInTaco,
      isOneOfTheAppsNotMapped:
        isOperatorMappedOnlyInRandomBeacon ||
        isOperatorMappedOnlyInTbtc ||
        isOperatorMappedOnlyInTaco,
      isOperatorMappedInAllApps:
        !isAddressZero(randomBeacon) &&
        !isAddressZero(tbtc) &&
        !isAddressZero(taco),
    }
  }
)
