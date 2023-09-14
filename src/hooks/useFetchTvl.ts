import { useState, useCallback, useMemo } from "react"
import { BigNumberish } from "ethers"
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
import { useAssetPoolContract } from "../web3/hooks/useAssetPoolContract"

interface TVLRawData {
  ecdsaTVL: string
  tbtcv1TVL: string
  coveragePoolTVL: string
  keepCoveragePoolTVL: string
  keepStakingTVL: string
  tStakingTVL: string
  tBTC: string
  // TODO: add PRE and NU TVL
}

interface TVLData {
  ecdsa: string
  tbtcv1: string
  coveragePool: string
  keepCoveragePool: string
  keepStaking: string
  tStaking: string
  tBTC: string
  total: string
}

const initialState = {
  ecdsaTVL: "0",
  tbtcv1TVL: "0",
  tBTC: "0",
  coveragePoolTVL: "0",
  keepCoveragePoolTVL: "0",
  keepStakingTVL: "0",
  tStakingTVL: "0",
}

export const useFetchTvl = (): [
  TVLData,
  () => Promise<TVLRawData>,
  TVLRawData
] => {
  const [rawData, setRawData] = useState<TVLRawData>(initialState)
  const {
    ecdsaTVL,
    tbtcv1TVL: tbtcTVL,
    coveragePoolTVL,
    keepCoveragePoolTVL,
    keepStakingTVL,
    tStakingTVL,
    tBTC: tBTCTVL,
  } = rawData

  const eth = useETHData()
  const keep = useToken(Token.Keep)
  const tbtcv1 = useToken(Token.TBTC)
  const t = useToken(Token.T)
  const keepBonding = useKeepBondingContract()
  const multicall = useMulticallContract()
  const assetPool = useAssetPoolContract()
  const keepAssetPool = useKeepAssetPoolContract()
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
      address: assetPool?.address!,
      interface: assetPool?.interface!,
      method: "totalValue",
    },
    {
      address: keepAssetPool?.address!,
      interface: keepAssetPool?.interface!,
      method: "totalValue",
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

  const fetchTVLData = useCallback(async () => {
    const chainData = await fetchOnChainData()
    if (chainData.length === 0) return initialState

    const [
      ethInKeepBonding,
      tbtcv1TokenTotalSupply,
      coveragePoolTVL,
      keepCoveragePoolTVL,
      keepStaking,
      tStaking,
      tBTCTokenTotalSupply,
    ] = chainData.map((amount: BigNumberish) => amount.toString())

    const data: TVLRawData = {
      ecdsaTVL: ethInKeepBonding,
      tbtcv1TVL: tbtcv1TokenTotalSupply,
      coveragePoolTVL: coveragePoolTVL,
      keepCoveragePoolTVL: keepCoveragePoolTVL,
      keepStakingTVL: keepStaking,
      tStakingTVL: tStaking,
      tBTC: tBTCTokenTotalSupply,
    }
    setRawData(data)

    return data
  }, [fetchOnChainData])

  const data = useMemo(() => {
    const ecdsa = toUsdBalance(formatUnits(ecdsaTVL), eth.usdPrice)

    const tbtcv1USD = toUsdBalance(formatUnits(tbtcTVL), tbtcv1.usdConversion)
    const tBTCUSD = toUsdBalance(formatUnits(tBTCTVL), tBTCToken.usdConversion)

    const coveragePool = toUsdBalance(
      formatUnits(coveragePoolTVL),
      t.usdConversion
    )

    const keepCoveragePool = toUsdBalance(
      formatUnits(keepCoveragePoolTVL),
      keep.usdConversion
    )

    const keepStaking = toUsdBalance(
      formatUnits(keepStakingTVL),
      keep.usdConversion
    )

    const tStaking = toUsdBalance(formatUnits(tStakingTVL), t.usdConversion)

    return {
      ecdsa: ecdsa.toString(),
      tbtcv1: tbtcv1USD.toString(),
      coveragePool: coveragePool.toString(),
      keepCoveragePool: keepCoveragePool.toString(),
      keepStaking: keepStaking.toString(),
      tStaking: tStaking.toString(),
      tBTC: tBTCUSD.toString(),
      total: ecdsa
        .addUnsafe(tbtcv1USD)
        .addUnsafe(keepCoveragePool)
        .addUnsafe(keepStaking)
        .addUnsafe(tStaking)
        .addUnsafe(tBTCUSD)
        .toString(),
    } as TVLData
  }, [
    ecdsaTVL,
    keepCoveragePoolTVL,
    tbtcTVL,
    keepStakingTVL,
    tStakingTVL,
    tBTCTVL,
    eth.usdPrice,
    keep.usdConversion,
    tbtcv1.usdConversion,
    t.usdConversion,
    tBTCToken.usdConversion,
  ])

  return [data, fetchTVLData, rawData]
}
