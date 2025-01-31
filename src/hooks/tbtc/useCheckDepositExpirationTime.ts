import { Hex } from "@keep-network/tbtc-v2.ts"
import { useCallback } from "react"
import { useThreshold } from "../../contexts/ThresholdContext"

export const useCheckDepositExpirationTime = () => {
  const threshold = useThreshold()

  return useCallback(
    async (refundLocktime: string) => {
      try {
        const refundLockTimestamp = parseInt(
          Hex.from(refundLocktime).reverse().toString(),
          16
        )

        const { depositRevealAheadPeriod } =
          (await threshold.tbtc.bridgeContract?.depositParameters()) ?? {}

        if (!depositRevealAheadPeriod) {
          throw new Error("Failed to retrieve deposit reveal ahead period.")
        }

        const currentTimestampInSeconds = Math.floor(Date.now() / 1000)
        const expirationTimestamp =
          currentTimestampInSeconds + depositRevealAheadPeriod

        return {
          expirationTimestamp,
          refundLockTimestamp,
          isExpired: currentTimestampInSeconds >= expirationTimestamp,
        }
      } catch (error) {
        console.error("Error checking deposit expiration time:", error)
        throw error
      }
    },
    [threshold]
  )
}
