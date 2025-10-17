import { useEffect, useRef, useState } from "react"
import { useThreshold } from "../../contexts/ThresholdContext"
import { isValidType, getContractPastEvents } from "../../threshold-ts/utils"
import { useGetBlock } from "../../web3/hooks"
import { isEmptyOrZeroAddress } from "../../web3/utils"
import { useFindRedemptionInBitcoinTx } from "./useFindRedemptionInBitcoinTx"
import { ethers, Event } from "ethers"
import { getEthereumDefaultProviderChainId } from "../../utils/getEnvVariable"
import { isMainnetChainId } from "../../networks/utils"

export interface CrossChainRedemptionDetails {
  requestedAmount: string // in token precision
  receivedAmount?: string // in satoshi
  redemptionRequestedTxHash: string
  redemptionCompletedTxHash?: {
    chain: string
    bitcoin: string
  }
  requestedAt?: number
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
  redeemer: FetchRedemptionDetailsParamType | null,
  encodedVm?: Uint8Array | null
) => {
  const threshold = useThreshold()
  const getBlock = useGetBlock()
  const findRedemptionInBitcoinTx = useFindRedemptionInBitcoinTx()
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState("")
  const [redemptionData, setRedemptionData] = useState<
    CrossChainRedemptionDetails | undefined
  >()
  const [previousEncodedVm, setPreviousEncodedVm] = useState<string | null>(
    null
  )
  const defaultChainId = getEthereumDefaultProviderChainId()
  const isMainnet = isMainnetChainId(defaultChainId)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setError("")

    // For cross-chain redemptions, encodedVm is required
    if (!encodedVm) {
      // Return empty redemption data immediately
      setRedemptionData(undefined)
      setPreviousEncodedVm(null)
      return
    }

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
      console.error(
        "L1BitcoinRedeemer contract is not available on the current network"
      )
      return
    }

    // Check if encodedVm has changed (new transaction)
    const currentEncodedVmHex = ethers.utils.hexlify(encodedVm)
    const hasEncodedVmChanged = previousEncodedVm !== currentEncodedVmHex

    // If encodedVm changed, reset the data
    if (hasEncodedVmChanged) {
      setRedemptionData(undefined)
      setPreviousEncodedVm(currentEncodedVmHex)
    }

    // If we already have redemption data with completedAt and encodedVm hasn't changed, don't refetch
    // This prevents unnecessary API calls for completed redemptions
    if (redemptionData?.completedAt && !hasEncodedVmChanged) {
      return
    }

    const fetch = async () => {
      setIsFetching(true)
      try {
        // Since redemptionOutputScript is indexed as bytes, we need to hash it
        const redemptionOutputScriptHash =
          ethers.utils.keccak256(redeemerOutputScript)

        // First try to get events with the hash filter
        // L1BitcoinRedeemer: RedemptionRequested(indexed uint256 redemptionKey, indexed bytes20 walletPubKeyHash, mainUtxo, indexed bytes redemptionOutputScript, uint256 amount, bytes encodedVm)
        // The event topics are: [eventSignature, redemptionKey, walletPubKeyHash, redemptionOutputScriptHash]
        // Since redemptionOutputScript is indexed bytes, we need to use its hash
        let redemptionRequestedEvents: Event[] = []

        // Get current block number to ensure we're not missing recent events
        const currentBlock =
          await threshold.tbtc.l1BitcoinRedeemerContract?.provider?.getBlockNumber()

        const allEvents = await getContractPastEvents(
          threshold.tbtc.l1BitcoinRedeemerContract!,
          {
            eventName: "RedemptionRequested",
            filterParams: [],
            fromBlock: isMainnet ? 23244313 : 8667161,
            toBlock: currentBlock || "latest",
          }
        )

        // Manually filter events by comparing the redemptionOutputScript hash and encodedVm if provided
        const filteredEventsPromises = allEvents.map(async (event, i) => {
          const eventScript = event.args?.redemptionOutputScript

          // Check if it's an Indexed object with hash property
          let scriptMatch = false
          if (eventScript && eventScript.hash) {
            scriptMatch =
              eventScript.hash.toLowerCase() ===
              redemptionOutputScriptHash.toLowerCase()
          }

          if (!scriptMatch) return null

          // Check the transaction input data to match encodedVm
          // encodedVm is NOT part of the event, only a function parameter
          if (!event.transactionHash) return null

          try {
            const provider = threshold.tbtc.l1BitcoinRedeemerContract?.provider
            if (!provider) return null

            const tx = await provider.getTransaction(event.transactionHash)
            if (!tx || !tx.data) return null

            // Decode the function call to get encodedVm parameter
            // Function signature: requestRedemption(bytes20,tuple(bytes32,uint32,uint64),bytes)
            const iface = threshold.tbtc.l1BitcoinRedeemerContract?.interface
            if (!iface) return null

            try {
              const decodedData = iface.decodeFunctionData(
                "requestRedemption",
                tx.data
              )
              const txEncodedVm = decodedData[2] // encodedVm is the 3rd parameter
              const encodedVmHex = ethers.utils.hexlify(encodedVm)

              if (txEncodedVm.toLowerCase() === encodedVmHex.toLowerCase()) {
                return event
              }
            } catch (decodeError) {
              console.error(
                "[useFetchCrossChainRedemptionDetails] Error decoding tx data:",
                decodeError
              )
            }

            return null
          } catch (txError) {
            console.error(
              "[useFetchCrossChainRedemptionDetails] Error fetching tx:",
              txError
            )
            return null
          }
        })

        const filteredResults = await Promise.all(filteredEventsPromises)

        redemptionRequestedEvents = filteredResults.filter(
          (event) => event !== null
        ) as Event[]

        if (redemptionRequestedEvents.length === 0) {
          // No matching events found with the provided encodedVm and redeemerOutputScript
          // Only clear data and retry if we don't already have completed data
          if (!redemptionData?.completedAt) {
            setRedemptionData(undefined)

            if (!intervalRef.current) {
              intervalRef.current = setInterval(() => {
                fetch()
              }, 30000) as unknown as NodeJS.Timeout
            }
          }
          return
        }

        // Clear interval if we found events
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }

        // Get the most recent event
        const redemptionRequestedEvent =
          redemptionRequestedEvents[redemptionRequestedEvents.length - 1]

        try {
          // Extract data from event
          const walletPublicKeyHash =
            redemptionRequestedEvent.args?.walletPubKeyHash
          const amount = redemptionRequestedEvent.args?.amount
          const { timestamp: redemptionRequestedEventTimestamp } =
            await getBlock(redemptionRequestedEvent.blockNumber)

          // Build redemption key to check status
          const computedRedemptionKey = threshold.tbtc.buildRedemptionKey(
            walletPublicKeyHash,
            redeemerOutputScript
          )

          // Check if the redemption has pending or timedOut status
          const { isPending, isTimedOut } =
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

          // Check if this is the redemption we're looking for
          // Note: The timestamp might not match exactly due to cross-chain timing differences
          // or if this is a different redemption with the same output script
          if (isTimedOut || isPending) {
            setRedemptionData({
              requestedAmount: amount.toString(), // Amount is already in token precision from L1BitcoinRedeemer
              redemptionRequestedTxHash:
                redemptionRequestedEvent.transactionHash,
              redemptionCompletedTxHash: undefined,
              redemptionTimedOutTxHash: timedOutTxHash,
              treasuryFee: "0",
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
              requestedAmount: amount.toString(),
              receivedAmount,
              redemptionRequestedTxHash:
                redemptionRequestedEvent.transactionHash,
              redemptionCompletedTxHash: {
                chain: txHash,
                bitcoin: redemptionBitcoinTxHash,
              },
              completedAt: redemptionCompletedTimestamp,
              treasuryFee: "0",
              isTimedOut: false,
              btcAddress,
              walletPublicKeyHash: walletPublicKeyHash,
              redemptionKey: computedRedemptionKey,
            })

            return
          }
        } catch (eventError) {
          console.error("Error processing redemption event:", eventError)
          throw eventError
        }
      } catch (error) {
        console.error("[useFetchCrossChainRedemptionDetails] Error:", error)
        setError((error as Error).toString())
      } finally {
        setIsFetching(false)
      }
    }

    fetch()

    // Cleanup function to clear interval when component unmounts or dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [
    redeemerOutputScript,
    redeemer,
    encodedVm,
    threshold,
    getBlock,
    findRedemptionInBitcoinTx,
  ])

  return { isFetching, data: redemptionData, error }
}
