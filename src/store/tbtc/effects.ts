import { AppListenerEffectAPI } from "../listener"
import { tbtcSlice } from "./tbtcSlice"
import { isAddress, isAddressZero } from "../../web3/utils"

export const fetchBridgeTxHitoryEffect = async (
  action: ReturnType<typeof tbtcSlice.actions.requestBridgeTransactionHistory>,
  listenerApi: AppListenerEffectAPI
) => {
  const { depositor } = action.payload
  if (!isAddress(depositor) || isAddressZero(depositor)) return

  listenerApi.unsubscribe()

  listenerApi.dispatch(tbtcSlice.actions.fetchingBridgeTransactionHistory())

  try {
    const data = await listenerApi.extra.threshold.tbtc.bridgeTxHistory(
      depositor
    )
    listenerApi.dispatch(
      tbtcSlice.actions.bridgeTransactionHistoryFetched(data)
    )
  } catch (error) {
    console.error("Could not fetch bridge transaction history: ", error)
    listenerApi.subscribe()
    listenerApi.dispatch(
      tbtcSlice.actions.bridgeTransactionHistoryFailed({
        error: "Could not fetch bridge transaction history.",
      })
    )
  }
}
