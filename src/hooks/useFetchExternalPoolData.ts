import { useCallback, useState } from "react"
import { CurveFactoryPoolId } from "../enums"
import { ExternalPoolData } from "../types/tbtc"
import { curveAPI } from "../utils/curveAPI"

const initialState = {
  poolName: "",
  address: "",
  url: "",
  apy: [],
  tvl: 0,
}

const pools = {
  curve: [CurveFactoryPoolId.TBTC_WBTC_SBTC],
} as const

type ExternalPool = keyof typeof pools
type ExternalPoolId<T extends ExternalPool> = typeof pools[T][number]

export const useFetchExternalPoolData = <T extends ExternalPool>(
  type: T,
  poolId: ExternalPoolId<T>
): [ExternalPoolData, () => Promise<ExternalPoolData>] => {
  const [data, setData] = useState<ExternalPoolData>(initialState)

  const fetchExternalPoolData =
    useCallback(async (): Promise<ExternalPoolData> => {
      if (type === "curve") {
        const factoryPool = await curveAPI.fetchFactoryPool(poolId)

        const poolTokens = factoryPool.underlyingCoins

        const poolName =
          poolTokens && poolTokens.length > 0
            ? poolTokens.reduce((accumulator, currentValue, index) => {
                if (index === poolTokens.length - 1) {
                  return accumulator + currentValue.symbol
                }
                return accumulator + currentValue.symbol + "/"
              }, "")
            : factoryPool.name

        const finalData = {
          poolName,
          address: factoryPool.address,
          url: factoryPool.poolUrls.deposit[0],
          apy: factoryPool.gaugeCrvApy,
          tvl: factoryPool.usdTotal,
        }
        setData(finalData)
        return finalData
      } else {
        throw new Error(
          `Error while fetching external pool data: fetching of ${type} external pool data is not implemented.`
        )
      }
    }, [type, poolId, curveAPI.fetchFactoryPool])

  return [data, fetchExternalPoolData]
}
