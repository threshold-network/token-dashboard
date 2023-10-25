import { BigNumber } from "ethers"
import { useEffect, useState } from "react"
import { useThreshold } from "../../contexts/ThresholdContext"
import {
  isValidType,
  fromSatoshiToTokenPrecision,
} from "../../threshold-ts/utils"
import { useGetBlock } from "../../web3/hooks"
import { isEmptyOrZeroAddress } from "../../web3/utils"
import { useFindRedemptionInBitcoinTx } from "./useFindRedemptionInBitcoinTx"

interface RedemptionDetails {
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
}

type FetchRedemptionDetailsParamType = string | null | undefined

export const useFetchRedemptionDetails = (
  redemptionRequestedTxHash: FetchRedemptionDetailsParamType,
  walletPublicKeyHash: FetchRedemptionDetailsParamType,
  redeemerOutputScript: FetchRedemptionDetailsParamType,
  redeemer: FetchRedemptionDetailsParamType
) => {
  const threshold = useThreshold()
  const getBlock = useGetBlock()
  const findRedemptionInBitcoinTx = useFindRedemptionInBitcoinTx()
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState("")
  const [redemptionData, setRedemptionData] = useState<
    RedemptionDetails | undefined
  >()

  useEffect(() => {
    if (!redeemer || isEmptyOrZeroAddress(redeemer)) {
      setError("Invalid redeemer value.")
      return
    }

    if (
      !redemptionRequestedTxHash ||
      !isValidType("bytes32", redemptionRequestedTxHash)
    ) {
      setError("Invalid transaction hash format.")
      return
    }

    if (!redeemerOutputScript || !isValidType("bytes", redeemerOutputScript)) {
      setError("Invalid redeemerOutputScript value.")
      return
    }
    if (!walletPublicKeyHash || !isValidType("bytes20", walletPublicKeyHash)) {
      setError("Invalid walletPublicKeyHash value.")
      return
    }

    const fetch = async () => {
      setIsFetching(true)
      try {
        const redemptionKey = threshold.tbtc.buildRedemptionKey(
          walletPublicKeyHash,
          redeemerOutputScript
        )

        // We need to find `RedemptionRequested` event by wallet public key hash
        // and `redeemer` address to get all necessary data and make sure that
        // the request actually happened. We need `redeemer` address as well to
        // reduce the number of records - any user can request redemption for
        // the same wallet.
        const redemptionRequestedEvent = (
          await threshold.tbtc.getRedemptionRequestedEvents({
            walletPublicKeyHash,
            redeemer,
          })
        ).find(
          (event) =>
            // It's not possible that the redemption request with the same
            // redemption key can be created in the same transaction - it means
            // that redemption key is unique and can be used for only one
            // pending request at the same time. We also need to find an event
            // by transaction hash because it's possible that there can be
            // multiple `RedemptionRequest` events with the same redemption key
            // but created at different times eg:
            // - redemption X requested,
            // - redemption X was handled successfully and the redemption X was
            //   removed from `pendingRedemptions` map,
            // - the same wallet is still in `live` state and can handle
            //   redemption request with the same `walletPubKeyHash` and
            //   `redeemerOutputScript` pair,
            // - now 2 `RedemptionRequested` events exist with the same
            //   redemption key(the same `walletPubKeyHash` and
            //   `redeemerOutputScript` pair).
            //
            // In that case we must know exactly which redemption request we
            // want to fetch.
            event.txHash === redemptionRequestedTxHash &&
            threshold.tbtc.buildRedemptionKey(
              event.walletPublicKeyHash,
              event.redeemerOutputScript
            ) === redemptionKey
        )

        if (!redemptionRequestedEvent) {
          throw new Error("Redemption not found...")
        }

        const { timestamp: redemptionRequestedEventTimestamp } = await getBlock(
          redemptionRequestedEvent.blockNumber
        )

        // We need to check if the redemption has `pending` or `timedOut` status.
        const { isPending, isTimedOut, requestedAt } =
          await threshold.tbtc.getRedemptionRequest(
            threshold.tbtc.buildRedemptionKey(
              walletPublicKeyHash,
              redeemerOutputScript
            )
          )

        // Find the transaction hash where the timeout was reported by
        // scanning the `RedemptionTimedOut` event by the `walletPubKeyHash`
        // param.
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
          // We need to make sure this is the same redemption request. Let's
          // consider this case:
          // - redemption X requested,
          // - redemption X was handled successfully and the redemption X was
          //   removed from `pendingRedemptions` map,
          // - the same wallet is still in `live` state and can handle
          //   redemption request with the same `walletPubKeyHash` and
          //   `redeemerOutputScript` pair(the same redemption request key),
          // - the redemption request X exists in the `pendingRedemptions` map.
          //
          // In that case we want to fetch redemption data for the first
          // request, so we must compare timestamps, otherwise the redemption
          // will be considered as pending.
          requestedAt === redemptionRequestedEventTimestamp
        ) {
          setRedemptionData({
            requestedAmount: fromSatoshiToTokenPrecision(
              redemptionRequestedEvent.amount
            ).toString(),
            redemptionRequestedTxHash: redemptionRequestedEvent.txHash,
            redemptionCompletedTxHash: undefined,
            requestedAt: requestedAt,
            redemptionTimedOutTxHash: timedOutTxHash,
            treasuryFee: fromSatoshiToTokenPrecision(
              redemptionRequestedEvent.treasuryFee
            ).toString(),
            isTimedOut,
          })
          return
        }

        // If we are here it means that the redemption request was handled
        // successfully and we need to find all `RedemptionCompleted` events
        // that happened after `redemptionRequest` block and filter by
        // `walletPubKeyHash` param.
        const redemptionCompletedEvents =
          await threshold.tbtc.getRedemptionsCompletedEvents({
            walletPublicKeyHash,
            fromBlock: redemptionRequestedEvent.blockNumber,
          })

        // For each event we should take `redemptionTxHash` param from
        // `RedemptionCompleted` event and check if in that Bitcoin transaction
        // we can find transfer to a `redeemerOutputScript` using
        // `bitcoinClient.getTransaction`.
        for (const {
          redemptionBitcoinTxHash,
          txHash,
          blockNumber: redemptionCompletedBlockNumber,
        } of redemptionCompletedEvents) {
          const redemptionBitcoinTransfer = await findRedemptionInBitcoinTx(
            redemptionBitcoinTxHash,
            redemptionCompletedBlockNumber,
            redemptionRequestedEvent.redeemerOutputScript
          )

          if (!redemptionBitcoinTransfer) continue

          const { receivedAmount, redemptionCompletedTimestamp, btcAddress } =
            redemptionBitcoinTransfer

          setRedemptionData({
            requestedAmount: fromSatoshiToTokenPrecision(
              redemptionRequestedEvent.amount
            ).toString(),
            receivedAmount,
            redemptionRequestedTxHash: redemptionRequestedEvent.txHash,
            redemptionCompletedTxHash: {
              chain: txHash,
              bitcoin: redemptionBitcoinTxHash,
            },
            requestedAt: redemptionRequestedEventTimestamp,
            completedAt: redemptionCompletedTimestamp,
            treasuryFee: fromSatoshiToTokenPrecision(
              redemptionRequestedEvent.treasuryFee
            ).toString(),
            isTimedOut: false,
            btcAddress,
          })

          return
        }
      } catch (error) {
        console.error("Could not fetch the redemption request details!", error)
        setError((error as Error).toString())
      } finally {
        setIsFetching(false)
      }
    }

    fetch()
  }, [
    redemptionRequestedTxHash,
    walletPublicKeyHash,
    redeemer,
    redeemerOutputScript,
    threshold,
    getBlock,
    findRedemptionInBitcoinTx,
  ])

  return { isFetching, data: redemptionData, error }
}
