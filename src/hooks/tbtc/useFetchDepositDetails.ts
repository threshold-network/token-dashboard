import { useEffect, useState } from "react"
import { useThreshold } from "../../contexts/ThresholdContext"
import { getContractPastEvents, isEmptyOrZeroAddress } from "../../web3/utils"
import { reverseTxHash } from "../../threshold-ts/utils"

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
}

export const useFetchDepositDetails = (depositKey: string | undefined) => {
  const threshold = useThreshold()
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState("")
  const [depositData, setDepositData] = useState<DepositData | undefined>()

  useEffect(() => {
    let isMounted = true
    const fetch = async () => {
      if (!isMounted) return

      setIsFetching(true)
      try {
        const { depositor } = (await threshold.tbtc.bridgeContract!.deposits(
          depositKey
        )) as {
          depositor: string
        }
        if (isEmptyOrZeroAddress(depositor)) {
          console.warn("Deposit not found, retrying in 10 seconds...")
          setIsFetching(false)

          // Retry fetching after 5 seconds because there can be
          // some time delay due to relayer bot for L2 transactions
          setTimeout(() => {
            if (isMounted) {
              fetch()
            }
          }, 5000)
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
        })
      } catch (error) {
        setError((error as Error).toString())
      } finally {
        setIsFetching(false)
      }
    }

    fetch()

    return () => {
      isMounted = false
    }
  }, [depositKey])

  return { isFetching, data: depositData, error }
}
