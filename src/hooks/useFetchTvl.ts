import { useState, useCallback, useMemo } from "react"
import { BigNumberish } from "ethers"
import { formatUnits } from "@ethersproject/units"
import {
  useKeepBondingContract,
  useMulticall,
  useMulticallContract,
  useTStakingContract,
  useKeepTokenStakingContract,
} from "../web3/hooks"
import { useETHData } from "./useETHData"
import { useToken } from "./useToken"
import { Token } from "../enums"
import { toUsdBalance } from "../utils/getUsdBalance"

interface TvlRawData {
  ecdsaTvl: string
  tbtcv1Tvl: string
  keepStakingTvl: string
  tStakingTvl: string
  tBTC: string
}

interface TvlData {
  ecdsa: string
  tbtcv1: string
  keepStaking: string
  tStaking: string
  tBTC: string
  total: string
}

const initialState = {
  ecdsaTvl: "0",
  tbtcv1Tvl: "0",
  keepStakingTvl: "0",
  tStakingTvl: "0",
  tBTC: "0",
}

export const useFetchTvl = (): [
  TvlData,
  () => Promise<TvlRawData>,
  TvlRawData
] => {
  const [rawData, setRawData] = useState<TvlRawData>(initialState)
  const {
    ecdsaTvl,
    tbtcv1Tvl: tbtcTvl,
    keepStakingTvl,
    tStakingTvl,
    tBTC: tBTCTvl,
  } = rawData

  const eth = useETHData()
  const keep = useToken(Token.Keep)
  const tbtcv1 = useToken(Token.TBTC)
  const t = useToken(Token.T)
  const keepBonding = useKeepBondingContract()
  const multicall = useMulticallContract()
  const tTokenStaking = useTStakingContract()
  const keepTokenStaking = useKeepTokenStakingContract()
  const tBTCToken = useToken(Token.TBTCV2)

  const fetchOnChainData = useMulticall([
    {
      address: multicall?.address!,
      interface: multicall?.interface!,
      method: "getEthBalance",
      args: [keepBonding?.address],
    },
    {
      address: tbtcv1.contract?.address!,
      interface: tbtcv1.contract?.interface!,
      method: "totalSupply",
    },
    {
      address: keep.contract?.address!,
      interface: keep.contract?.interface!,
      method: "balanceOf",
      args: [keepTokenStaking?.address],
    },
    {
      address: t.contract?.address!,
      interface: t.contract?.interface!,
      method: "balanceOf",
      args: [tTokenStaking?.address],
    },
    {
      address: tBTCToken.contract?.address!,
      interface: tBTCToken.contract?.interface!,
      method: "totalSupply",
    },
  ])

  const fetchTvlData = useCallback(async () => {
    const chainData = await fetchOnChainData()
    if (chainData.length === 0) return initialState

    const [
      ethInKeepBonding,
      tbtcv1TokenTotalSupply,
      keepStaking,
      tStaking,
      tBTCTokenTotalSupply,
    ] = chainData.map((amount: BigNumberish) => amount.toString())

    const data: TvlRawData = {
      ecdsaTvl: ethInKeepBonding,
      tbtcv1Tvl: tbtcv1TokenTotalSupply,
      keepStakingTvl: keepStaking,
      tStakingTvl: tStaking,
      tBTC: tBTCTokenTotalSupply,
    }
    setRawData(data)

    return data
  }, [fetchOnChainData])

  const data = useMemo(() => {
    const ecdsa = toUsdBalance(formatUnits(ecdsaTvl), eth.usdPrice)

    const tbtcv1USD = toUsdBalance(formatUnits(tbtcTvl), tbtcv1.usdConversion)
    const tBTCUSD = toUsdBalance(formatUnits(tBTCTvl), tBTCToken.usdConversion)

    const keepStaking = toUsdBalance(
      formatUnits(keepStakingTvl),
      keep.usdConversion
    )

    const tStaking = toUsdBalance(formatUnits(tStakingTvl), t.usdConversion)

    return {
      ecdsa: ecdsa.toString(),
      tbtcv1: tbtcv1USD.toString(),
      keepStaking: keepStaking.toString(),
      tStaking: tStaking.toString(),
      tBTC: tBTCUSD.toString(),
      total: ecdsa
        .addUnsafe(tbtcv1USD)
        .addUnsafe(keepStaking)
        .addUnsafe(tStaking)
        .addUnsafe(tBTCUSD)
        .toString(),
    } as TvlData
  }, [
    ecdsaTvl,
    tbtcTvl,
    keepStakingTvl,
    tStakingTvl,
    tBTCTvl,
    eth.usdPrice,
    keep.usdConversion,
    tbtcv1.usdConversion,
    t.usdConversion,
    tBTCToken.usdConversion,
  ])

  return [data, fetchTvlData, rawData]
}
