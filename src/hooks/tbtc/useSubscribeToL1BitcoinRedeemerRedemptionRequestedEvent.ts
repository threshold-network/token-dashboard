import { useSubscribeToContractEvent } from "../../web3/hooks"
import { useThreshold } from "../../contexts/ThresholdContext"
import { BigNumber, Event } from "ethers"

type L1BitcoinRedeemerRedemptionRequestedEventCallback = (
  redemptionKey: BigNumber,
  walletPublicKeyHash: string,
  mainUtxo: any,
  redemptionOutputScript: string,
  amount: BigNumber,
  event: Event
) => void

export const useSubscribeToL1BitcoinRedeemerRedemptionRequestedEvent = (
  callback: L1BitcoinRedeemerRedemptionRequestedEventCallback,
  filterParams?: any[],
  shouldSubscribeIfUserNotConnected?: boolean
) => {
  const threshold = useThreshold()
  const contract = threshold.tbtc.l1BitcoinRedeemerContract

  useSubscribeToContractEvent(
    contract,
    "RedemptionRequested",
    //@ts-ignore
    async (
      redemptionKey: BigNumber,
      walletPublicKeyHash: string,
      mainUtxo: any,
      redemptionOutputScript: string,
      amount: BigNumber,
      event: Event
    ) => {
      callback(
        redemptionKey,
        walletPublicKeyHash,
        mainUtxo,
        redemptionOutputScript,
        amount,
        event
      )
    },
    filterParams ?? [],
    !!shouldSubscribeIfUserNotConnected
  )
}
