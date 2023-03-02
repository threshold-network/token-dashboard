import axios from "axios"
import { CurveFactoryPoolId } from "../enums"

export type FactoryPool = {
  id: CurveFactoryPoolId
  address: string
  poolUrls: {
    swap: string[]
    deposit: string[]
    withdraw: string[]
  }
  gaugeCrvApy: number[]
}

const fetchFactoryPool = async (factoryPoolId: CurveFactoryPoolId) => {
  const response = await axios.get(
    "https://api.curve.fi/api/getPools/ethereum/factory"
  )
  const factoryPool: FactoryPool | undefined = response.data.data.poolData.find(
    (factoryPool: FactoryPool) => factoryPool.id === factoryPoolId
  )

  if (!factoryPool) {
    throw new Error("Could not fetch the curve pool data.")
  }

  return factoryPool
}

const fetchFactoryTvl = async (): Promise<number> => {
  const response = await axios.get("https://api.curve.fi/api/getFactoryTVL")

  return response.data.data.factoryBalances
}

export const curveAPI = {
  fetchFactoryPool,
  fetchFactoryTvl,
}
