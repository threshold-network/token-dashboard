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

  useSubscribeToContractEvent<RedemptionsCompletedEventCallback>(
    tBTCBridgeContract,
    "RedemptionsCompleted",
    (walletPublicKeyHash, redemptionTxHash, event) => {
      const reversedRedemptionTxHash = [...redemptionTxHash].reverse().join("")

      callback(walletPublicKeyHash, reversedRedemptionTxHash, event)
    },
    filterParams,
    shouldSubscribeIfUserNotConnected
  )
}
