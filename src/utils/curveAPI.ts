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

const fetchFactoryPoolData = async (factoryPoolId: CurveFactoryPoolId) => {
  const response = await axios.get(
    `https://api.curve.fi/api/getPools/ethereum/factory`
  )
  const factoryPool: FactoryPool | undefined = response.data.find(
    (factoryPool: FactoryPool) => factoryPool.id === factoryPoolId
  )

  if (!factoryPool) {
    throw new Error("Could not fetch the curve pool data.")
  }

  return {
    address: factoryPool.address,
    url: factoryPool.poolUrls.deposit,
    apy: factoryPool.gaugeCrvApy,
  }
}

export const curveAPI = {
  fetchFactoryPoolData,
}
