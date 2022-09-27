import { AnyAction } from "@reduxjs/toolkit"
import { AppListenerEffectAPI } from "../listener"
import { setRolesOf } from "./connectedAccountSlice"

export const getRolesOf = async (
  action: AnyAction,
  listenerApi: AppListenerEffectAPI
) => {
  try {
    const { connectedAccount } = listenerApi.getState()
    const { address } = connectedAccount

    if (address) {
      listenerApi.unsubscribe()
      const { owner, authorizer, beneficiary } =
        await listenerApi.extra.threshold.staking.rolesOf(address)
      listenerApi.dispatch(
        setRolesOf({
          owner,
          authorizer,
          beneficiary,
        })
      )
    }
  } catch (error) {
    console.log("Could not fetch roles for connected staking provider: ", error)
    listenerApi.subscribe()
  }
}
