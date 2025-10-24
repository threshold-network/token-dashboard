import { FC, useEffect, useState } from "react"
import {
  Box,
  Flex,
  Button,
  Text,
  Stack,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import { useThreshold } from "../../../../contexts/ThresholdContext"
import { useIsActive } from "../../../../hooks/useIsActive"
import { ClaimableWithdrawal } from "../../../../threshold-ts/bridge"
import { formatUnits } from "ethers/lib/utils"
import { BigNumber } from "ethers"
import { SupportedChainIds } from "../../../../networks/enums/networks"

interface ClaimableWithdrawalsCardProps {
  onClaim?: () => void
}

export const ClaimableWithdrawalsCard: FC<ClaimableWithdrawalsCardProps> = ({
  onClaim,
}) => {
  const { account, chainId } = useIsActive()
  const threshold = useThreshold()
  const [withdrawals, setWithdrawals] = useState<ClaimableWithdrawal[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isClaiming, setIsClaiming] = useState<string | null>(null)
  const [isProving, setIsProving] = useState<string | null>(null)
  const [error, setError] = useState<Record<string, string>>({})
  const [currentTime, setCurrentTime] = useState(Date.now())

  const bgColor = useColorModeValue("gray.50", "gray.700")
  const borderColor = useColorModeValue("gray.200", "gray.600")

  useEffect(() => {
    if (!account || !chainId || !threshold.bridge) {
      setWithdrawals([])
      return
    }

    // Only fetch on L1 networks
    const isL1 =
      chainId === SupportedChainIds.Ethereum ||
      chainId === SupportedChainIds.Sepolia
    if (!isL1) {
      setWithdrawals([])
      return
    }

    const fetchWithdrawals = async () => {
      setIsLoading(true)
      try {
        const result = await threshold.bridge.fetchClaimableWithdrawals(account)
        setWithdrawals(result)
      } catch (error) {
        console.error("Failed to fetch claimable withdrawals:", error)
        setWithdrawals([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchWithdrawals()
    // Refresh every 60 seconds
    const interval = setInterval(fetchWithdrawals, 60000)
    return () => clearInterval(interval)
  }, [account, chainId, threshold.bridge])

  // Update current time every second for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleProve = async (withdrawal: ClaimableWithdrawal) => {
    setIsProving(withdrawal.txHash)
    setError((prev) => ({ ...prev, [withdrawal.txHash]: "" }))
    try {
      // Trigger wallet via bridge prove – this should open the L1 wallet for signing
      const proveHash = await threshold.bridge.proveWithdrawal(
        withdrawal.txHash
      )

      // Get the provider to wait for transaction
      const provider = (threshold.bridge.getContext() as any)?.provider
      if (provider && proveHash) {
        const receipt = await provider.waitForTransaction(proveHash)
        console.log("Proof transaction confirmed:", receipt)
      }

      // Refresh the list after transaction is confirmed
      if (account && threshold.bridge) {
        const result = await threshold.bridge.fetchClaimableWithdrawals(account)
        setWithdrawals(result)
      }
    } catch (error: any) {
      console.error("Failed to prove withdrawal:", error)
      setError((prev) => ({
        ...prev,
        [withdrawal.txHash]: error.message || "Failed to prove withdrawal",
      }))
    } finally {
      setIsProving(null)
    }
  }

  const handleClaim = async (withdrawal: ClaimableWithdrawal) => {
    setIsClaiming(withdrawal.txHash)
    setError((prev) => ({ ...prev, [withdrawal.txHash]: "" }))
    try {
      // Trigger wallet via bridge claim – this should open the L1 wallet for signing
      const tx = await threshold.bridge.claimWithdrawal(withdrawal.txHash)

      // Wait for transaction confirmation
      if ((tx as any)?.wait) {
        const receipt = await (tx as any).wait()
        console.log("Claim transaction confirmed:", receipt)
      }

      // Refresh the list
      if (account && threshold.bridge) {
        const result = await threshold.bridge.fetchClaimableWithdrawals(account)
        setWithdrawals(result)
      }

      onClaim?.()
    } catch (error: any) {
      console.error("Failed to claim withdrawal:", error)

      // Check if the error is about maturity
      if (error.message?.includes("not matured yet")) {
        setError((prev) => ({
          ...prev,
          [withdrawal.txHash]:
            "Withdrawal proof has not matured yet. Please wait for the challenge period to elapse (7 days).",
        }))
      } else {
        setError((prev) => ({
          ...prev,
          [withdrawal.txHash]: error.message || "Failed to claim withdrawal",
        }))
      }
    } finally {
      setIsClaiming(null)
    }
  }

  const formatAmount = (amount: string) => {
    try {
      return formatUnits(BigNumber.from(amount), 18)
    } catch {
      return "0"
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeRemaining = (readyAt: number) => {
    const now = Math.floor(Date.now() / 1000)
    const remaining = readyAt - now

    if (remaining <= 0) return "Ready to claim"

    const hours = Math.floor(remaining / 3600)
    const minutes = Math.floor((remaining % 3600) / 60)

    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days} day${days > 1 ? "s" : ""} remaining`
    }

    return `${hours}h ${minutes}m remaining`
  }

  const formatCountdown = (timestamp: number, isReady: boolean = false) => {
    const now = Math.floor(currentTime / 1000)
    const diff = isReady ? timestamp - now : now - timestamp

    if (diff <= 0 && isReady) return "00:00:00"

    const hours = Math.floor(Math.abs(diff) / 3600)
    const minutes = Math.floor((Math.abs(diff) % 3600) / 60)
    const seconds = Math.floor(Math.abs(diff) % 60)

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Don't show the card on non-L1 networks or if no withdrawals
  if (
    (chainId !== SupportedChainIds.Ethereum &&
      chainId !== SupportedChainIds.Sepolia) ||
    (!isLoading && withdrawals.length === 0)
  ) {
    return null
  }

  return (
    <Box borderWidth={1} borderRadius="md" overflow="hidden">
      <Box p={4} borderBottomWidth={1} borderColor={borderColor}>
        <Text fontSize="lg" fontWeight="semibold">
          Claimable Withdrawals
        </Text>
      </Box>
      <Box p={4}>
        {isLoading && <Text color="gray.500">Loading withdrawals...</Text>}
        {!isLoading && withdrawals.length === 0 && (
          <Stack spacing={2}>
            <Text color="gray.500">No withdrawals to claim</Text>
            <Text fontSize="sm" color="gray.400">
              To withdraw tBTC from BOB back to Ethereum, you need to initiate a
              withdrawal on the BOB network first.
            </Text>
          </Stack>
        )}
        {!isLoading && withdrawals.length > 0 && (
          <Stack spacing={3}>
            {withdrawals.map((withdrawal) => (
              <Box
                key={withdrawal.txHash}
                p={4}
                bg={bgColor}
                borderRadius="md"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Flex
                  justify="space-between"
                  align="center"
                  wrap="wrap"
                  gap={3}
                >
                  <Stack spacing={1} flex="1">
                    <Flex gap={2} align="center" wrap="wrap">
                      <Text fontWeight="medium">{withdrawal.network}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {formatDate(withdrawal.timestamp)}
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        (
                        {Math.floor(
                          (Date.now() / 1000 - withdrawal.timestamp) / 3600
                        )}{" "}
                        hours ago)
                      </Text>
                    </Flex>
                    <Text fontSize="lg" fontWeight="semibold">
                      {formatAmount(withdrawal.amount)} tBTC
                    </Text>
                    {/* Show countdown timer */}
                    {withdrawal.proven && withdrawal.readyAt > 0 ? (
                      <Flex align="center" gap={2}>
                        <Text fontSize="sm" color="gray.500">
                          Time until claim:
                        </Text>
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          color={
                            withdrawal.canClaim ? "green.500" : "orange.500"
                          }
                        >
                          {formatCountdown(withdrawal.readyAt, true)}
                        </Text>
                      </Flex>
                    ) : (
                      <Stack spacing={1}>
                        <Flex align="center" gap={2}>
                          <Text fontSize="sm" color="gray.500">
                            Time since withdrawal:
                          </Text>
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="gray.600"
                          >
                            {formatCountdown(withdrawal.timestamp, false)}
                          </Text>
                        </Flex>
                        {!withdrawal.proven && withdrawal.outputPosted && (
                          <Text
                            fontSize="xs"
                            color="orange.500"
                            fontStyle="italic"
                          >
                            L2 output posted - submit proof to start 7-day
                            challenge period
                          </Text>
                        )}
                        {!withdrawal.proven && !withdrawal.outputPosted && (
                          <Text
                            fontSize="xs"
                            color="gray.400"
                            fontStyle="italic"
                          >
                            Waiting for L2 output (~1-4 hours) before proof can
                            be submitted
                          </Text>
                        )}
                      </Stack>
                    )}
                  </Stack>

                  {withdrawal.claimed ? (
                    <Button
                      size="sm"
                      isDisabled
                      variant="outline"
                      colorScheme="gray"
                    >
                      Claimed
                    </Button>
                  ) : !withdrawal.outputPosted ? (
                    <Tooltip label="Waiting for L2 state root to be posted to L1. This typically takes 1-4 hours.">
                      <Button
                        size="sm"
                        isDisabled
                        variant="outline"
                        colorScheme="gray"
                      >
                        Waiting for L2 Output
                      </Button>
                    </Tooltip>
                  ) : !withdrawal.proven && withdrawal.outputPosted ? (
                    <Button
                      size="sm"
                      colorScheme="brand"
                      onClick={() => handleProve(withdrawal)}
                      isLoading={isProving === withdrawal.txHash}
                      loadingText="Submitting Proof..."
                    >
                      Submit Proof
                    </Button>
                  ) : withdrawal.proven && withdrawal.canClaim ? (
                    <Button
                      size="sm"
                      colorScheme="brand"
                      onClick={() => handleClaim(withdrawal)}
                      isLoading={isClaiming === withdrawal.txHash}
                      loadingText="Claiming..."
                    >
                      Claim
                    </Button>
                  ) : withdrawal.proven &&
                    !withdrawal.canClaim &&
                    withdrawal.readyAt > 0 ? (
                    <Tooltip
                      label={`Proof submitted. ${getTimeRemaining(
                        withdrawal.readyAt
                      )}`}
                    >
                      <Button
                        size="sm"
                        isDisabled
                        variant="outline"
                        colorScheme="gray"
                      >
                        Proven (Not Ready)
                      </Button>
                    </Tooltip>
                  ) : (
                    <Tooltip label="Withdrawal in progress">
                      <Button
                        size="sm"
                        isDisabled
                        variant="outline"
                        colorScheme="gray"
                      >
                        Processing
                      </Button>
                    </Tooltip>
                  )}
                </Flex>
                {error[withdrawal.txHash] && (
                  <Text fontSize="sm" color="red.500" mt={2}>
                    {error[withdrawal.txHash]}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  )
}
