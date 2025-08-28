import { useState, useEffect } from "react"
import { useWeb3React } from "@web3-react/core"

interface L2RedemptionRequestedEvent {
  sender: string
  amount: string
  redeemerOutputScript: string
  txHash: string
  blockNumber: number
}

export const useFetchL2RedemptionRequestedEvent = (
  txHash: string | null | undefined,
  enabled: boolean = true
) => {
  const { library: provider } = useWeb3React()
  const [data, setData] = useState<L2RedemptionRequestedEvent | null>(null)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!txHash || !enabled) {
      setData(null)
      return
    }

    const fetchEvent = async () => {
      try {
        setIsFetching(true)
        setError(null)

        // First get the transaction receipt to find the block number
        const receipt = await provider?.getTransactionReceipt(txHash)
        if (!receipt) {
          throw new Error("Transaction receipt not found")
        }

        // For cross-chain redemptions, the event is on L2 where the transaction was sent
        // So we just mark it as successful if we have a receipt
        if (receipt.status === 1) {
          console.log(
            "[useFetchL2RedemptionRequestedEvent] Transaction successful, marking as L2 redemption event found"
          )
          setData({
            sender: receipt.from,
            amount: "0", // We don't have the amount from the receipt
            redeemerOutputScript: "", // We don't have this from the receipt
            txHash: receipt.transactionHash,
            blockNumber: receipt.blockNumber,
          })
          setIsFetching(false)
          return
        }

        setError("Transaction failed")
        console.error("[useFetchL2RedemptionRequestedEvent] Transaction failed")

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
  }, [txHash, enabled, provider])

  return { data, isFetching, error }
}
