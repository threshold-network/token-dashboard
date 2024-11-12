import { useState, useCallback, useMemo, useRef, useEffect } from "react"
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
import { useIsActive } from "./useIsActive"
import { ContractCall } from "../threshold-ts/multicall"

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

const initialState: TvlRawData = {
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
  const { chainId } = useIsActive()
  const [rawData, setRawData] = useState<TvlRawData>(initialState)
  const isMountedRef = useRef(true)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

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

  const calls: Array<ContractCall & { key: string }> = []

  if (keepBonding && multicall) {
    calls.push({
      address: multicall.address,
      interface: multicall.interface,
      method: "getEthBalance",
      args: [keepBonding.address],
      key: "ecdsaTvl",
    })
  }

  if (tbtcv1.contract) {
    calls.push({
      address: tbtcv1.contract.address,
      interface: tbtcv1.contract.interface,
      method: "totalSupply",
      args: [],
      key: "tbtcv1Tvl",
    })
  }

  if (keep.contract && keepTokenStaking) {
    calls.push({
      address: keep.contract.address,
      interface: keep.contract.interface,
      method: "balanceOf",
      args: [keepTokenStaking.address],
      key: "keepStakingTvl",
    })
  }

  if (t.contract && tTokenStaking) {
    calls.push({
      address: t.contract.address,
      interface: t.contract.interface,
      method: "balanceOf",
      args: [tTokenStaking.address],
      key: "tStakingTvl",
    })
  }

  if (tBTCToken.contract) {
    calls.push({
      address: tBTCToken.contract.address,
      interface: tBTCToken.contract.interface,
      method: "totalSupply",
      args: [],
      key: "tBTC",
    })
  }

  const fetchOnChainData = useMulticall(calls)

  const fetchTvlData = useCallback(async () => {
    if (chainId && !isL1Network(chainId)) return initialState
    const chainData = await fetchOnChainData()
    if (chainData.length === 0) return initialState

    const data: TvlRawData = { ...initialState }

    chainData.forEach((result: BigNumberish, index: number) => {
      const key = calls[index].key as keyof TvlRawData
      data[key] = result ? result.toString() : "0"
    })

    if (isMountedRef.current) {
      setRawData(data)
    }
    return data
  }, [fetchOnChainData, chainId])

  const data = useMemo(() => {
    const ecdsa = toUsdBalance(formatUnits(ecdsaTvl), eth.usdPrice)

    const tbtcv1USD = toUsdBalance(formatUnits(tbtcTvl), tbtcv1.usdConversion)
    const tBTCUSD = toUsdBalance(formatUnits(tBTCTvl), tBTCToken.usdConversion)

    const keepStakingUSD = toUsdBalance(
      formatUnits(keepStakingTvl),
      keep.usdConversion
    )

    const tStakingUSD = toUsdBalance(formatUnits(tStakingTvl), t.usdConversion)

    const total = ecdsa
      .addUnsafe(tbtcv1USD)
      .addUnsafe(keepStakingUSD)
      .addUnsafe(tStakingUSD)
      .addUnsafe(tBTCUSD)
      .toString()

    return {
      ecdsa: ecdsa.toString(),
      tbtcv1: tbtcv1USD.toString(),
      keepStaking: keepStakingUSD.toString(),
      tStaking: tStakingUSD.toString(),
      tBTC: tBTCUSD.toString(),
      total,
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
