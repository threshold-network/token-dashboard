import { useEffect, useState } from "react"
import { useThreshold } from "../../contexts/ThresholdContext"
import { fromSatoshiToTokenPrecision, ZERO } from "../../threshold-ts/utils"
import { ONE_HUNDRED, SATOSHI_MULTIPLIER } from "../../constants/web3"

export type DepositData = {
  depositTreasuryFee: string
  optimisticMintingFee: string
  depositTxMaxFee: string
}

export const useFetchTBTCFees = () => {
  const threshold = useThreshold()
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState("")
  const [tbtcFees, setTbtcFees] = useState<DepositData>({
    depositTreasuryFee: "",
    optimisticMintingFee: "",
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

        const oneHundredInSatoshi = ONE_HUNDRED.mul(SATOSHI_MULTIPLIER)

        const depositTreasuryFee = depositTreasuryFeeDivisor.gt(ZERO)
          ? oneHundredInSatoshi.div(depositTreasuryFeeDivisor)
          : ZERO
        const optimisticMintingFee = optimisticMintingFeeDivisor.gt(ZERO)
          ? oneHundredInSatoshi.div(optimisticMintingFeeDivisor)
          : ZERO

        const depositTreasuryFeeToTokenPrecision =
          fromSatoshiToTokenPrecision(depositTreasuryFee)

        const optimisticMintingFeeToTokenPrecision =
          fromSatoshiToTokenPrecision(optimisticMintingFee)
        const crossChainDepositTxFee =
          fromSatoshiToTokenPrecision(depositTxMaxFee)

        if (isMounted.current) {
          setTbtcFees({
            depositTreasuryFee: depositTreasuryFeeToTokenPrecision.toString(),
            optimisticMintingFee:
              optimisticMintingFeeToTokenPrecision.toString(),
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
  }, [threshold.tbtc.ethereumChainId])

  return { isFetching, data: tbtcFees, error }
}
