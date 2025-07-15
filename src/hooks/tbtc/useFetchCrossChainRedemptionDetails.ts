import { useEffect, useState } from "react"
import { useThreshold } from "../../contexts/ThresholdContext"
import {
  isValidType,
  fromSatoshiToTokenPrecision,
  getContractPastEvents,
} from "../../threshold-ts/utils"
import { useGetBlock } from "../../web3/hooks"
import { isEmptyOrZeroAddress } from "../../web3/utils"
import { useFindRedemptionInBitcoinTx } from "./useFindRedemptionInBitcoinTx"

interface CrossChainRedemptionDetails {
  requestedAmount: string // in token precision
  receivedAmount?: string // in satoshi
  redemptionRequestedTxHash: string
  redemptionCompletedTxHash?: {
    chain: string
    bitcoin: string
  }
  requestedAt: number
  completedAt?: number
  treasuryFee: string // in token precision
  isTimedOut: boolean
  redemptionTimedOutTxHash?: string
  btcAddress?: string
  walletPublicKeyHash: string
  redemptionKey: string
}

type FetchRedemptionDetailsParamType = string | null | undefined

export const useFetchCrossChainRedemptionDetails = (
  redeemerOutputScript: FetchRedemptionDetailsParamType,
  redeemer: FetchRedemptionDetailsParamType
) => {
  const threshold = useThreshold()
  const getBlock = useGetBlock()
  const findRedemptionInBitcoinTx = useFindRedemptionInBitcoinTx()
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState("")
  const [redemptionData, setRedemptionData] = useState<
    CrossChainRedemptionDetails | undefined
  >()

  useEffect(() => {
    setError("")
    if (!redeemer || isEmptyOrZeroAddress(redeemer)) {
      setError("Invalid redeemer value.")
      return
    }

    if (!redeemerOutputScript || !isValidType("bytes", redeemerOutputScript)) {
      setError("Invalid redeemerOutputScript value.")
      return
    }

    if (!threshold.tbtc.l1BitcoinRedeemerContract) {
      setError("L1 Bitcoin Redeemer contract not initialized.")
      return
    }

    const fetch = async () => {
      setIsFetching(true)
      try {
        // Get RedemptionRequested events from L1BTCRedeemerWormhole filtered by redeemerOutputScript
        const redemptionRequestedEvents = await getContractPastEvents(
          threshold.tbtc.l1BitcoinRedeemerContract!,
          {
            eventName: "RedemptionRequested",
            // Filter by indexed redemptionOutputScript parameter (4th parameter in event)
            filterParams: [null, null, null, redeemerOutputScript],
            fromBlock: 0, // You might want to optimize this with a more recent block
          }
        )

        if (redemptionRequestedEvents.length === 0) {
          throw new Error("Cross-chain redemption not found...")
        }

        // Get the most recent event
        const redemptionRequestedEvent =
          redemptionRequestedEvents[redemptionRequestedEvents.length - 1]

        // Extract data from event
        const redemptionKey = redemptionRequestedEvent.args?.redemptionKey
        const walletPublicKeyHash =
          redemptionRequestedEvent.args?.walletPubKeyHash
        const amount = redemptionRequestedEvent.args?.amount
        const mainUtxo = redemptionRequestedEvent.args?.mainUtxo

        const { timestamp: redemptionRequestedEventTimestamp } = await getBlock(
          redemptionRequestedEvent.blockNumber
        )

        // Build redemption key to check status
        const computedRedemptionKey = threshold.tbtc.buildRedemptionKey(
          walletPublicKeyHash,
          redeemerOutputScript
        )

        // Check if the redemption has pending or timedOut status
        const { isPending, isTimedOut, requestedAt } =
          await threshold.tbtc.getRedemptionRequest(computedRedemptionKey)

        // Find timeout event if timed out
        const timedOutTxHash: undefined | string = isTimedOut
          ? (
              await threshold.tbtc.getRedemptionTimedOutEvents({
                walletPublicKeyHash,
                fromBlock: redemptionRequestedEvent.blockNumber,
              })
            ).find(
              (event) => event.redeemerOutputScript === redeemerOutputScript
            )?.txHash
          : undefined

        if (
          (isTimedOut || isPending) &&
          requestedAt === redemptionRequestedEventTimestamp
        ) {
          setRedemptionData({
            requestedAmount: fromSatoshiToTokenPrecision(amount).toString(),
            redemptionRequestedTxHash: redemptionRequestedEvent.transactionHash,
            redemptionCompletedTxHash: undefined,
            requestedAt: requestedAt,
            redemptionTimedOutTxHash: timedOutTxHash,
            treasuryFee: "0", // Treasury fee is not available in L1BTCRedeemerWormhole event
            isTimedOut,
            walletPublicKeyHash: walletPublicKeyHash,
            redemptionKey: computedRedemptionKey,
          })
          return
        }

        // If redemption was completed, find the completion event
        const redemptionCompletedEvents =
          await threshold.tbtc.getRedemptionsCompletedEvents({
            walletPublicKeyHash,
            fromBlock: redemptionRequestedEvent.blockNumber,
          })

        for (const {
          redemptionBitcoinTxHash,
          txHash,
          blockNumber: redemptionCompletedBlockNumber,
        } of redemptionCompletedEvents) {
          const redemptionBitcoinTransfer = await findRedemptionInBitcoinTx(
            redemptionBitcoinTxHash,
            redemptionCompletedBlockNumber,
            redeemerOutputScript
          )

          if (!redemptionBitcoinTransfer) continue

          const { receivedAmount, redemptionCompletedTimestamp, btcAddress } =
            redemptionBitcoinTransfer

          setRedemptionData({
            requestedAmount: fromSatoshiToTokenPrecision(amount).toString(),
            receivedAmount,
            redemptionRequestedTxHash: redemptionRequestedEvent.transactionHash,
            redemptionCompletedTxHash: {
              chain: txHash,
              bitcoin: redemptionBitcoinTxHash,
            },
            requestedAt: redemptionRequestedEventTimestamp,
            completedAt: redemptionCompletedTimestamp,
            treasuryFee: "0",
            isTimedOut: false,
            btcAddress,
            walletPublicKeyHash: walletPublicKeyHash,
            redemptionKey: computedRedemptionKey,
          })

          return
        }
      } catch (error) {
        console.error(
          "Could not fetch the cross-chain redemption request details!",
          error
        )
        setError((error as Error).toString())
      } finally {
        setIsFetching(false)
      }
    }

    fetch()
  }, [
    redeemerOutputScript,
    redeemer,
    threshold,
    getBlock,
    findRedemptionInBitcoinTx,
  ])

  return { isFetching, data: redemptionData, error }
}
