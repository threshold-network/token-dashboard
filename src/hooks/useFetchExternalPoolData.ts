import { useEffect, useState } from "react"
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

const fetchCurvePool: (
  poolId: ExternalPoolId<"curve">
) => Promise<ExternalPoolData> = async (poolId) => {
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

  return finalData
}

const fetchPoolDataStrategy: {
  [key in ExternalPool]: (
    poolId: ExternalPoolId<key>
  ) => Promise<ExternalPoolData>
} = {
  curve: fetchCurvePool,
}

export const useFetchExternalPoolData = <T extends ExternalPool>(
  type: T,
  poolId: ExternalPoolId<T>
): ExternalPoolData => {
  const [data, setData] = useState<ExternalPoolData>(initialState)

  useEffect(() => {
    const fetchExternalPoolData = async () => {
      try {
        const fetchPoolData = fetchPoolDataStrategy[type]
        const data = await fetchPoolData(poolId)
        setData(data)
      } catch (error) {
        console.error(
          `Could not fetch external pool data ${type} ${poolId}: `,
          error
        )
      }
    }

    fetchExternalPoolData()
  }, [type, poolId])

  return data
}
