import { useState, useEffect } from "react"
import { useIsActive } from "../useIsActive"
import { isTestnetChainId } from "../../networks/utils"

// Helper function to decode base64 to Uint8Array
function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

interface ApiVaa {
  sequence: number
  id: string
  version: number
  emitterChain: number
  emitterAddr: string
  emitterNativeAddr: string
  guardianSetIndex: number
  vaa: string
  timestamp: string
  updatedAt: string
  indexedAt: string
  txHash: string
}

const RETRY_INTERVAL = 60000 // 60 seconds

export const useFetchVaaFromTxHash = (
  txHash: string | null | undefined,
  enabled: boolean = true
) => {
  const { chainId } = useIsActive()

  // Determine the correct Wormholescan API URL based on network
  const WORMHOLESCAN_API_URL =
    chainId && isTestnetChainId(chainId)
      ? "https://api.testnet.wormholescan.io"
      : "https://api.wormholescan.io"
  const [data, setData] = useState<{
    encodedVm: Uint8Array
    vaa: ApiVaa
  } | null>(null)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!txHash || !enabled) {
      setData(null)
      return
    }

    let intervalId: NodeJS.Timeout | null = null

    const fetchVaa = async () => {
      try {
        setIsFetching(true)
        setError(null)

        const url = `${WORMHOLESCAN_API_URL}/api/v1/vaas?txHash=${txHash}`
        const response = await fetch(url)

        if (!response.ok && response.status === 404) {
          // Handle 404 as a case where we should retry indefinitely
          if (!intervalId) {
            intervalId = setInterval(fetchVaa, RETRY_INTERVAL)
          }
          return
        } else if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = (await response.json()) as { data: ApiVaa[] }

        if (data.data && data.data.length > 0) {
          const vaa = data.data[0]
          const encodedVm = base64ToUint8Array(vaa.vaa)

          setData({ encodedVm, vaa })
          setIsFetching(false)

          if (intervalId) {
            clearInterval(intervalId)
          }
          return
        }

        // If no VAA found, continue retrying indefinitely
        if (!intervalId) {
          intervalId = setInterval(fetchVaa, RETRY_INTERVAL)
        }
      } catch (err) {
        // For other errors, stop retrying
        console.error("[useFetchVaaFromTxHash] Error fetching VAA:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch VAA")
        setIsFetching(false)
        if (intervalId) {
          clearInterval(intervalId)
        }
      }
    }

    // Start fetching
    fetchVaa()

    // Cleanup
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [txHash, enabled, WORMHOLESCAN_API_URL])

  return { data, isFetching, error }
}
