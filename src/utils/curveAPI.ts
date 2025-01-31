import axios from "axios"
import { CurveFactoryPoolId, ApiUrl, endpointUrl } from "../enums"

export type FactoryPool = {
  id: CurveFactoryPoolId
  address: string
  name: string
  underlyingCoins: {
    symbol: string
  }[]
  poolUrls: {
    swap: string[]
    deposit: string[]
    withdraw: string[]
  }
  gaugeCrvApy: number[]
  usdTotal: number
}

const fetchFactoryPool = async (factoryPoolId: CurveFactoryPoolId) => {
  const response = await axios.get(
    `${ApiUrl.CURVE}${endpointUrl.CURVE_ETHEREUM_POOL}`
  )
  const factoryPool: FactoryPool | undefined = response.data.data.poolData.find(
    (factoryPool: FactoryPool) => factoryPool.id === factoryPoolId
  )

  if (!factoryPool) {
    throw new Error("Could not fetch the curve pool data.")
  }

  return factoryPool
}

export const curveAPI = {
  fetchFactoryPool,
}
