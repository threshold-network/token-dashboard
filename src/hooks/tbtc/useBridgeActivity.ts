import { useEffect, useState } from "react"
import { useIsActive } from "../useIsActive"
import { useThreshold } from "../../contexts/ThresholdContext"
import { BridgeActivity } from "../../threshold-ts/bridge"

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
        // Try to fetch from a smaller block range - last ~5k blocks
        const activities = await threshold.bridge.fetchBridgeActivities(
          account,
          -5000
        )

        if (!mounted) return

        // Double-check filtering based on current chainId
        const isBobNetwork = chainId === 60808 || chainId === 808813
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
  }, [account, chainId, threshold.bridge])

  return {
    data: bridgeActivities,
    isFetching,
  }
}
