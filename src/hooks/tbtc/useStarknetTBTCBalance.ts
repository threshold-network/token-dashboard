import { useEffect, useState } from "react"
import { formatUnits } from "ethers/lib/utils"
import { useThreshold } from "../../contexts/ThresholdContext"
import { useNonEVMConnection } from "../useNonEVMConnection"
import { ChainName } from "../../threshold-ts/types"

interface UseStarknetTBTCBalanceResult {
  balance: string
  isLoading: boolean
  error: string | null
  refetch: () => void
}

/**
 * Hook to fetch tBTC balance on Starknet
 * @return {UseStarknetTBTCBalanceResult} Balance, loading state, error, and refetch function
 */
export function useStarknetTBTCBalance(): UseStarknetTBTCBalanceResult {
  const [balance, setBalance] = useState<string>("0")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const threshold = useThreshold()
  const { nonEVMChainName, nonEVMPublicKey } = useNonEVMConnection()

  const isStarknetConnected =
    nonEVMChainName === ChainName.Starknet && !!nonEVMPublicKey

  const fetchBalance = async () => {
    if (!isStarknetConnected || !nonEVMPublicKey) {
      setBalance("0")
      setIsLoading(false)
      setError(null)
      return
    }

    // Skip balance fetch if tBTC token is not initialized
    // This can happen when the network is disabled or initialization failed
    if (!threshold.tbtc.l2TbtcToken) {
      setBalance("0")
      setIsLoading(false)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Validate StarkNet address format
      if (!nonEVMPublicKey.startsWith("0x") || nonEVMPublicKey.length < 40) {
        setBalance("0")
        setError("Invalid address format")
        return
      }

      // Fetch balance using the SDK's l2TbtcToken
      const balanceResult = await threshold.tbtc.l2TbtcToken.balanceOf(
        nonEVMPublicKey
      )

      // Convert balance to string and format (tBTC has 18 decimals)
      const balanceString = balanceResult.toString()
      const formattedBalance = formatUnits(balanceString, 18)

      // Clean up trailing zeros but preserve precision
      const cleanBalance = formattedBalance.replace(/\.?0+$/, "") || "0"

      // Ensure at least one decimal place for non-zero amounts
      const finalBalance =
        cleanBalance.includes(".") || cleanBalance === "0"
          ? cleanBalance
          : cleanBalance + ".0"

      setBalance(finalBalance)
      setError(null)
    } catch (err) {
      // Don't set error state for disabled networks
      setBalance("0")
      setError(null) // Don't show error in UI
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBalance()
  }, [isStarknetConnected, nonEVMPublicKey, threshold.tbtc.l2TbtcToken])

  return {
    balance,
    isLoading,
    error,
    refetch: fetchBalance,
  }
}
