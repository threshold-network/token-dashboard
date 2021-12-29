import { useState, useCallback, useMemo } from "react"
import { FixedNumber } from "@ethersproject/bignumber"
import { formatUnits } from "@ethersproject/units"
import {
  useKeepBondingContract,
  useMulticall,
  useMulticallContract,
  useKeepAssetPoolContract,
} from "../web3/hooks"
import { useETHData } from "./useETHData"
import { useToken } from "./useToken"
import { Token } from "../enums"

interface TVLRawData {
  ecdsaTVL: string
  tbtcTVL: string
  keepCoveragePoolTVL: string
  // TODO: add PRE
}

const initialState = {
  ecdsaTVL: "0",
  tbtcTVL: "0",
  keepCoveragePoolTVL: "0",
}

export const useFetchTvl = (): [
  {
    ecdsa: string
    tbtc: string
    keepCoveragePool: string
    total: string
  },
  () => Promise<TVLRawData>
] => {
  const [rawData, setRawData] = useState<TVLRawData>(initialState)
  const { ecdsaTVL, tbtcTVL, keepCoveragePoolTVL } = rawData
  const eth = useETHData()
  const keep = useToken(Token.Keep)
  const tbtc = useToken(Token.TBTC)
  const keepBonding = useKeepBondingContract()
  const multicall = useMulticallContract()
  const keepAssetPool = useKeepAssetPoolContract()

  const fetchOnChainData = useMulticall([
    {
      contract: multicall!,
      method: "getEthBalance",
      args: [keepBonding?.address],
    },
    {
      contract: tbtc.contract!,
      method: "totalSupply",
    },
    { contract: keepAssetPool!, method: "totalValue" },
  ])

  const fetchTVLData = useCallback(async () => {
    const chainData = await fetchOnChainData()
    if (chainData.length === 0) return initialState

    const [ethInKeepBonding, tbtcTokenTotalSupply, coveragePoolTvl] =
      chainData.map((amount: string) => formatUnits(amount.toString()))

    const data = {
      ecdsaTVL: ethInKeepBonding,
      tbtcTVL: tbtcTokenTotalSupply,
      keepCoveragePoolTVL: coveragePoolTvl,
    }
    setRawData(data)

    return data
  }, [fetchOnChainData])

  const data = useMemo(() => {
    const ecdsa = FixedNumber.fromString(ecdsaTVL).mulUnsafe(
      FixedNumber.fromString(eth.usdPrice.toString())
    )

    const tbtcUSD = FixedNumber.fromString(tbtcTVL).mulUnsafe(
      FixedNumber.fromString(tbtc.usdConversion.toString())
    )

    const keepCoveragePool = FixedNumber.fromString(
      keepCoveragePoolTVL
    ).mulUnsafe(FixedNumber.fromString(keep.usdConversion.toString()))

    return {
      ecdsa: ecdsa.toString(),
      tbtc: tbtcUSD.toString(),
      keepCoveragePool: keepCoveragePool.toString(),
      total: ecdsa.addUnsafe(tbtcUSD).addUnsafe(keepCoveragePool).toString(),
    }
  }, [
    ecdsaTVL,
    keepCoveragePoolTVL,
    tbtcTVL,
    eth.usdPrice,
    keep.usdConversion,
    tbtc.usdConversion,
  ])

  return [data, fetchTVLData]
}
