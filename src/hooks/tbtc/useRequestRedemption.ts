import { useThreshold } from "../../contexts/ThresholdContext"
import {
  OnErrorCallback,
  OnSuccessCallback,
  useSendTransactionFromFn,
} from "../../web3/hooks"
import { useSendLedgerLiveAppTransactionFromFn } from "../ledger-live-app/web3"
import { useEmbedFeatureFlag } from "../useEmbedFeatureFlag"

export const useRequestRedemption = (
  onSuccess?: OnSuccessCallback,
  onError?: OnErrorCallback
) => {
  const threshold = useThreshold()
  const { isEmbed } = useEmbedFeatureFlag()

  return isEmbed
    ? useSendLedgerLiveAppTransactionFromFn(
        threshold.tbtc.requestRedemption,
        onSuccess,
        onError
      )
    : useSendTransactionFromFn(
        threshold.tbtc.requestRedemption,
        onSuccess,
        onError
      )
}
