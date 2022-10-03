import { AnyAction } from "@reduxjs/toolkit"
import { isAddressZero } from "../../web3/utils"
import { AppListenerEffectAPI } from "../listener"
import { mapOperatorToStakingProviderModalClosed } from "../modalQueue"
import { setRolesOf } from "./connectedAccountSlice"

export const getRolesOf = async (
  action: AnyAction,
  listenerApi: AppListenerEffectAPI
) => {
  try {
    const { connectedAccount } = listenerApi.getState()
    const { address } = connectedAccount

    if (!address) return
    listenerApi.unsubscribe()
    const { owner, authorizer, beneficiary } =
      await listenerApi.extra.threshold.staking.rolesOf(address)
    if (
      isAddressZero(owner) &&
      isAddressZero(authorizer) &&
      isAddressZero(beneficiary)
    ) {
      listenerApi.dispatch(mapOperatorToStakingProviderModalClosed())
    }
    listenerApi.dispatch(
      setRolesOf({
        owner,
        authorizer,
        beneficiary,
      })
    )
  } catch (error) {
    console.log("Could not fetch roles for connected staking provider: ", error)
    listenerApi.subscribe()
  }
}
