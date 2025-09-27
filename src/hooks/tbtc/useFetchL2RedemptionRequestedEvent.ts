import { useState, useEffect } from "react"
import { useWeb3React } from "@web3-react/core"
import { useThreshold } from "../../contexts/ThresholdContext"
import { BigNumber } from "ethers"
import { CrossChainRedemptionDetails } from "./useFetchCrossChainRedemptionDetails"

export const useFetchL2RedemptionRequestedEvent = (
  txHash: string | null | undefined,
  enabled: boolean = true
) => {
  const { library: provider } = useWeb3React()
  const threshold = useThreshold()
  const [data, setData] = useState<CrossChainRedemptionDetails | null>(null)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!txHash || !enabled || !provider) {
      setData(null)
      return
    }

    const fetchEvent = async () => {
      if (data) return
      try {
        setIsFetching(true)
        setError(null)

        // First get the transaction receipt to find the block number
        const receipt = await provider?.getTransactionReceipt(txHash)
        if (!receipt) {
          throw new Error("Transaction receipt not found")
        }

        if (receipt.status !== 1) {
          throw new Error("Transaction failed")
        }

        // Get the L2BitcoinRedeemer contract
        const l2BitcoinRedeemerContract =
          threshold.tbtc.l2BitcoinRedeemerContract

        if (!l2BitcoinRedeemerContract) {
          console.warn(
            "[useFetchL2RedemptionRequestedEvent] L2BitcoinRedeemer contract not available"
          )
          // Fallback to basic data from receipt
          setData(null)
          setIsFetching(false)
          return
        }

        // Parse logs to find RedemptionRequestedOnL2 event
        const eventSignature = "RedemptionRequestedOnL2(uint256,bytes,uint32)"

        const eventTopic =
          l2BitcoinRedeemerContract._instance.interface.getEventTopic(
            eventSignature
          )

        const logs = receipt.logs.filter(
          (log: any) =>
            log.topics[0] === eventTopic &&
            log.address.toLowerCase() ===
              l2BitcoinRedeemerContract._instance.address.toLowerCase()
        )

        if (logs.length === 0) {
          console.warn(
            "[useFetchL2RedemptionRequestedEvent] RedemptionRequestedOnL2 event not found in transaction"
          )
          // Fallback to basic data from receipt
          setData(null)
          setIsFetching(false)
          return
        }

        // Parse the event
        const parsedLog =
          l2BitcoinRedeemerContract._instance.interface.parseLog(logs[0])
        const sender = parsedLog.args.sender
        const amount = parsedLog.args.amount as BigNumber
        const redeemerOutputScript = parsedLog.args.redeemerOutputScript

        // Get block timestamp for requestedAt
        const block = await provider?.getBlock(receipt.blockNumber)
        const requestedAt = block?.timestamp || 0

        setData({
          requestedAmount: amount.toString(),
          redemptionRequestedTxHash: "",
          requestedAt,
          completedAt: 0,
          treasuryFee: "0",
          isTimedOut: false,
          redemptionTimedOutTxHash: undefined,
          btcAddress: undefined,
          walletPublicKeyHash: "",
          redemptionKey: "",
        })
        setIsFetching(false)
      } catch (err) {
        console.error(
          "[useFetchL2RedemptionRequestedEvent] Error fetching event:",
          err
        )
        setError(err instanceof Error ? err.message : "Failed to fetch event")
        setIsFetching(false)
      }
    }

    fetchEvent()
  }, [txHash, enabled, provider, threshold.tbtc.l2BitcoinRedeemerContract])

  return { data, isFetching, error }
}
