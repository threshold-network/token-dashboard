import { useState, useCallback, useMemo } from "react"
import { FixedNumber } from "@ethersproject/bignumber"
import { formatUnits } from "@ethersproject/units"
import {
  useKeepBondingContract,
  useMulticall,
  useMulticallContract,
  useKeepAssetPoolContract,
  useTStakingContract,
  useKeepTokenStakingContract,
} from "../web3/hooks"
import { useETHData } from "./useETHData"
import { useToken } from "./useToken"
import { Token } from "../enums"
import { toUsdBalance } from "../utils/getUsdBalance"

interface TVLRawData {
  ecdsaTVL: string
  tbtcTVL: string
  keepCoveragePoolTVL: string
  keepStakingTVL: string
  tStakingTVL: string
  // TODO: add PRE and NU TVL
}

interface TVLData {
  ecdsa: string
  tbtc: string
  keepCoveragePool: string
  keepStaking: string
  tStaking: string
  total: string
}

const initialState = {
  ecdsaTVL: "0",
  tbtcTVL: "0",
  keepCoveragePoolTVL: "0",
  keepStakingTVL: "0",
  tStakingTVL: "0",
}

export const useFetchTvl = (): [TVLData, () => Promise<TVLRawData>] => {
  const [rawData, setRawData] = useState<TVLRawData>(initialState)
  const {
    ecdsaTVL,
    tbtcTVL,
    keepCoveragePoolTVL,
    keepStakingTVL,
    tStakingTVL,
  } = rawData

  const eth = useETHData()
  const keep = useToken(Token.Keep)
  const tbtc = useToken(Token.TBTC)
  const t = useToken(Token.T)
  const keepBonding = useKeepBondingContract()
  const multicall = useMulticallContract()
  const keepAssetPool = useKeepAssetPoolContract()
  const tTokenStaking = useTStakingContract()
  const keepTokenStaking = useKeepTokenStakingContract()

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
    {
      contract: keep.contract!,
      method: "balanceOf",
      args: [keepTokenStaking?.address],
    },
    {
      contract: t.contract!,
      method: "balanceOf",
      args: [tTokenStaking?.address],
    },
  ])

  const fetchTVLData = useCallback(async () => {
    const chainData = await fetchOnChainData()
    if (chainData.length === 0) return initialState

    const [
      ethInKeepBonding,
      tbtcTokenTotalSupply,
      coveragePoolTvl,
      keepStaking,
      tStaking,
    ] = chainData.map((amount: string) => formatUnits(amount.toString()))

    const data: TVLRawData = {
      ecdsaTVL: ethInKeepBonding,
      tbtcTVL: tbtcTokenTotalSupply,
      keepCoveragePoolTVL: coveragePoolTvl,
      keepStakingTVL: keepStaking,
      tStakingTVL: tStaking,
    }
    setRawData(data)

    return data
  }, [fetchOnChainData])

  const data = useMemo(() => {
    const ecdsa = toUsdBalance(ecdsaTVL, eth.usdPrice)

    const tbtcUSD = toUsdBalance(tbtcTVL, tbtc.usdConversion)

    const keepCoveragePool = toUsdBalance(
      keepCoveragePoolTVL,
      keep.usdConversion
    )

    const keepStaking = toUsdBalance(keepStakingTVL, keep.usdConversion)

    const tStaking = toUsdBalance(tStakingTVL, t.usdConversion)

    return {
      ecdsa: ecdsa.toString(),
      tbtc: tbtcUSD.toString(),
      keepCoveragePool: keepCoveragePool.toString(),
      keepStaking: keepStaking.toString(),
      tStaking: tStaking.toString(),
      total: ecdsa
        .addUnsafe(tbtcUSD)
        .addUnsafe(keepCoveragePool)
        .addUnsafe(keepStaking)
        .addUnsafe(tStaking)
        .toString(),
    } as TVLData
  }, [
    ecdsaTVL,
    keepCoveragePoolTVL,
    tbtcTVL,
    keepStakingTVL,
    tStakingTVL,
    eth.usdPrice,
    keep.usdConversion,
    tbtc.usdConversion,
    t.usdConversion,
  ])

  return [data, fetchTVLData]
}
