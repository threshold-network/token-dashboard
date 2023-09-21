import { Hex } from "@keep-network/tbtc-v2.ts"
import { Event } from "ethers"
import { useSubscribeToContractEvent } from "../../web3/hooks"
import { useBridgeContract } from "./useBridgeContract"

type RedemptionsCompletedEventCallback = (
  walletPublicKeyHash: string,
  redemptionTxHash: string,
  event: Event
) => void

export const useSubscribeToRedemptionsCompletedEventBase = (
  callback: RedemptionsCompletedEventCallback,
  filterParams?: any[],
  shouldSubscribeIfUserNotConnected: boolean = false
) => {
  const tBTCBridgeContract = useBridgeContract()

  useSubscribeToContractEvent(
    tBTCBridgeContract,
    "RedemptionsCompleted",
    //@ts-ignore
    (walletPublicKeyHash, redemptionTxHash, event) => {
      callback(
        walletPublicKeyHash,
        Hex.from(redemptionTxHash).reverse().toString(),
        event
      )
    },
    filterParams,
    shouldSubscribeIfUserNotConnected
  )
}
