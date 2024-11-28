import { useEffect, useState } from "react"
import { useThreshold } from "../../contexts/ThresholdContext"
import { fromSatoshiToTokenPrecision } from "../../threshold-ts/utils"

export type DepositData = {
  depositTreasuryFeeDivisor: string
  depositRevealedTxHash: string
  depositTxMaxFee: string
}

export const useFetchTBTCFees = () => {
  const threshold = useThreshold()
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState("")
  const [tbtcFees, setTbtcFees] = useState<DepositData>({
    depositTreasuryFeeDivisor: "",
    depositRevealedTxHash: "",
    depositTxMaxFee: "",
  })

  useEffect(() => {
    const isMounted = { current: true }

    const fetch = async () => {
      setIsFetching(true)
      try {
        if (!isMounted.current) return

        const {
          depositTreasuryFeeDivisor,
          optimisticMintingFeeDivisor,
          depositTxMaxFee,
        } = await threshold.tbtc.getDepositFees()

        const crossChainDepositTxFee =
          fromSatoshiToTokenPrecision(depositTxMaxFee)

        if (isMounted.current) {
          setTbtcFees({
            depositTreasuryFeeDivisor: depositTreasuryFeeDivisor.toString(),
            depositRevealedTxHash: optimisticMintingFeeDivisor.toString(),
            depositTxMaxFee: crossChainDepositTxFee.toString(),
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
  }, [threshold.tbtc])

  return { isFetching, data: tbtcFees, error }
}
