import { useCallback } from "react"
import { useThreshold } from "../../contexts/ThresholdContext"
import {
  createAddressFromOutputScript,
  prependScriptPubKeyByLength,
} from "../../threshold-ts/utils"
import { useGetBlock } from "../../web3/hooks"

export const useFindRedemptionInBitcoinTx = () => {
  const threshold = useThreshold()
  const getBlock = useGetBlock()

  return useCallback(
    async (
      redemptionBitcoinTxHash: string,
      redemptionCompletedBlockNumber: number,
      redeemerOutputScript: string
    ) => {
      const { outputs } = await threshold.tbtc.getBitcoinTransaction(
        redemptionBitcoinTxHash
      )

      for (const { scriptPubKey, value } of outputs) {
        if (
          prependScriptPubKeyByLength(scriptPubKey.toString()) !==
          redeemerOutputScript
        )
          continue

        const { timestamp: redemptionCompletedTimestamp } = await getBlock(
          redemptionCompletedBlockNumber
        )

        return {
          btcAddress: createAddressFromOutputScript(
            scriptPubKey,
            threshold.tbtc.bitcoinNetwork
          ),
          receivedAmount: value.toString(),
          bitcoinTxHash: redemptionBitcoinTxHash,
          redemptionCompletedTimestamp,
        }
      }
    },
    [threshold, getBlock]
  )
}
