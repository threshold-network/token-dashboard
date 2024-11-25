import { useEffect, useState } from "react"
import { useThreshold } from "../../contexts/ThresholdContext"
import { getContractPastEvents, isEmptyOrZeroAddress } from "../../web3/utils"
import { reverseTxHash } from "../../threshold-ts/utils"
import { DepositState } from "@keep-network/tbtc-v2.ts"

export type DepositData = {
  depositRevealedTxHash: string
  amount: string
  btcTxHash: string
  optimisticMintingRequestedTxHash?: string
  optimisticMintingFinalizedTxHash?: string
  confirmations: number
  requiredConfirmations: number
  treasuryFee: string
  optimisticMintFee: string
  isCrossChainDeposit: boolean
  l1BitcoinDepositorDepositStatus?: DepositState
}

export const useFetchDepositDetails = (depositKey: string | undefined) => {
  const threshold = useThreshold()
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState("")
  const [depositData, setDepositData] = useState<DepositData | undefined>()

  useEffect(() => {
    const isMounted = { current: true }

    const fetch = async () => {
      setIsFetching(true)
      try {
        const { depositor } = (await threshold.tbtc.bridgeContract!.deposits(
          depositKey
        )) as {
          depositor: string
        }
        if (!isMounted.current) return

        if (isEmptyOrZeroAddress(depositor)) {
          console.warn("Deposit not found, retrying in 10 seconds...")
          setIsFetching(false)

          // Retry fetching after 10 seconds because there can be
          // some time delay due to relayer bot for L2 transactions
          setTimeout(() => {
            if (isMounted.current) {
              fetch()
            }
          }, 10000)
          return
        }

        const revealedDeposits = await threshold.tbtc.findAllRevealedDeposits(
          depositor
        )

        const deposit = revealedDeposits.find(
          (deposit) => deposit.depositKey === depositKey
        )

        if (!deposit) {
          throw new Error(
            "Could not find DepositRevealed event by given deposit key."
          )
        }

        const l1BitcoinDepositorDepositStatus = !!threshold.tbtc
          .l1BitcoinDepositorContract
          ? await threshold.tbtc.l1BitcoinDepositorContract.deposits(depositKey)
          : DepositState.UNKNOWN

        const isCrossChainDeposit = !!l1BitcoinDepositorDepositStatus

        const optimisticMintingRequestedEvents = await getContractPastEvents(
          threshold.tbtc.vaultContract!,
          {
            eventName: "OptimisticMintingRequested",
            fromBlock: deposit.blockNumber,
            filterParams: [undefined, depositKey, depositor],
          }
        )

        const optimisticMintingFinalizedEvents = await getContractPastEvents(
          threshold.tbtc.vaultContract!,
          {
            eventName: "OptimisticMintingFinalized",
            fromBlock: deposit.blockNumber,
            filterParams: [undefined, depositKey, depositor],
          }
        )

        const btcTxHash = reverseTxHash(deposit.fundingTxHash)
        const confirmations = await threshold.tbtc.getTransactionConfirmations(
          btcTxHash
        )
        const requiredConfirmations =
          threshold.tbtc.minimumNumberOfConfirmationsNeeded(deposit.amount)

        const { treasuryFee, optimisticMintFee, amountToMint } =
          await threshold.tbtc.getEstimatedDepositFees(deposit.amount)

        if (isMounted.current) {
          setDepositData({
            btcTxHash: btcTxHash.toString(),
            depositRevealedTxHash: deposit.txHash,
            amount: amountToMint,
            treasuryFee,
            optimisticMintFee,
            optimisticMintingRequestedTxHash:
              optimisticMintingRequestedEvents[0]?.transactionHash,
            optimisticMintingFinalizedTxHash:
              optimisticMintingFinalizedEvents[0]?.transactionHash,
            requiredConfirmations,
            confirmations,
            isCrossChainDeposit,
            l1BitcoinDepositorDepositStatus,
          })
        }
      } catch (error) {
        if (isMounted.current) setError((error as Error).toString())
      } finally {
        if (isMounted.current) setIsFetching(false)
      }
    }

    fetch()

    return () => {
      isMounted.current = false
    }
  }, [depositKey])

  return { isFetching, data: depositData, error }
}
