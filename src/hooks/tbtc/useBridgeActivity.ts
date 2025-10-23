import { useEffect, useState, useCallback } from "react"
import { useIsActive } from "../useIsActive"
import { useThreshold } from "../../contexts/ThresholdContext"
import { BridgeActivity } from "../../threshold-ts/bridge"

const BLOCKS_TO_FETCH = 500000 // 90 days on Ethereum, 45 days on L2s

// Re-export types from bridge module
export type {
  BridgeActivityStatus,
  BridgeActivity as BridgeActivityData,
} from "../../threshold-ts/bridge"

export const useBridgeActivity = () => {
  const { account, chainId } = useIsActive()
  const threshold = useThreshold()
  const [bridgeActivities, setBridgeActivities] = useState<BridgeActivity[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (!account || !chainId || !threshold.bridge) {
      setBridgeActivities([])
      return
    }

    let mounted = true

    const fetchBridgeActivity = async () => {
      if (!mounted) return

      setIsFetching(true)
      try {
        // Use the bridge interface method to fetch activities
        const activities = await threshold.bridge.fetchBridgeActivities(
          account,
          -BLOCKS_TO_FETCH
        )

        if (!mounted) return

        // Double-check filtering based on current chainId
        const isBobNetwork = chainId === SupportedChainIds.Bob || chainId === SupportedChainIds.BobSepolia
        const filtered = activities.filter((activity) => {
          if (isBobNetwork) {
            // On BOB: show activities where BOB is either source or destination
            return (
              activity.fromNetwork.includes("BOB") ||
              activity.toNetwork.includes("BOB")
            )
          } else {
            // On Ethereum: show activities where Ethereum is either source or destination
            return (
              activity.fromNetwork.includes("Ethereum") ||
              activity.toNetwork.includes("Ethereum")
            )
          }
        })

        if (mounted) {
          setBridgeActivities(filtered)
        }
      } catch (error) {
        console.error("Failed to fetch bridge activities:", error)
        if (mounted) {
          setBridgeActivities([])
        }
      } finally {
        if (mounted) {
          setIsFetching(false)
        }
      }
    }

    fetchBridgeActivity()

    return () => {
      mounted = false
    }
  }, [account, chainId, threshold.bridge, refreshTrigger])

  // Add periodic refresh every 30 seconds
  useEffect(() => {
    if (!account || !chainId || !threshold.bridge) return

    const interval = setInterval(() => {
      setRefreshTrigger((prev) => prev + 1)
    }, 60000) // 60 seconds

    return () => clearInterval(interval)
  }, [account, chainId, threshold.bridge])

  const refetch = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1)
  }, [])

  return {
    data: bridgeActivities,
    isFetching,
    refetch,
  }
}
