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
  useContract,
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
  stakedNU: string
  ethInNuNetwork: string
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
  stakedNU: "0",
  ethInNuNetwork: "0",
}

// TODO: Get contract abi from the package and figure out how to use these
// contracts on ropste and local network. This only works on mainnet.
const ESCROW_ABI = [
  {
    inputs: [],
    name: "currentPeriodSupply",
    outputs: [{ internalType: "uint128", name: "", type: "uint128" }],
    stateMutability: "view",
    type: "function",
  },
]

const ESCROW_ADDRESS = "0xbbD3C0C794F40c4f993B03F65343aCC6fcfCb2e2"
const useNuStakingEscrowContract = () => {
  return useContract(ESCROW_ADDRESS, ESCROW_ABI)
}

const WORK_LOCK_ADDRESS = "0xe9778E69a961e64d3cdBB34CF6778281d34667c2"

export const useFetchTvl = (): [TVLData, () => Promise<TVLRawData>] => {
  const [rawData, setRawData] = useState<TVLRawData>(initialState)
  const {
    ecdsaTVL,
    tbtcTVL,
    keepCoveragePoolTVL,
    keepStakingTVL,
    tStakingTVL,
    stakedNU,
    ethInNuNetwork,
  } = rawData

  const eth = useETHData()
  const keep = useToken(Token.Keep)
  const tbtc = useToken(Token.TBTC)
  const t = useToken(Token.T)
  const nu = useToken(Token.Nu)
  const nuStakingEscrow = useNuStakingEscrowContract()
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
    {
      contract: nu.contract!,
      method: "totalSupply",
    },
    {
      contract: nuStakingEscrow!,
      method: "currentPeriodSupply",
    },
    {
      contract: nu.contract!,
      method: "balanceOf",
      args: [nuStakingEscrow?.address],
    },
    {
      contract: multicall!,
      method: "getEthBalance",
      args: [WORK_LOCK_ADDRESS],
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
      nuTotalSupply,
      nuCurrenctPeriodSupply,
      nuInEscrow,
      ethInNuNetwork,
    ] = chainData.map((amount: string) => formatUnits(amount.toString()))

    const stakedNU = FixedNumber.fromString(nuInEscrow)
      .subUnsafe(
        FixedNumber.fromString(nuTotalSupply).subUnsafe(
          FixedNumber.fromString(nuCurrenctPeriodSupply)
        )
      )
      .toString()

    const data: TVLRawData = {
      ecdsaTVL: ethInKeepBonding,
      tbtcTVL: tbtcTokenTotalSupply,
      keepCoveragePoolTVL: coveragePoolTvl,
      keepStakingTVL: keepStaking,
      tStakingTVL: tStaking,
      stakedNU,
      ethInNuNetwork,
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

    const stakedNuInUSD = toUsdBalance(stakedNU, nu.usdConversion)
    const ethInNu = toUsdBalance(ethInNuNetwork, eth.usdPrice)
    const totalNu = stakedNuInUSD.addUnsafe(ethInNu)

    return {
      ecdsa: ecdsa.toString(),
      tbtc: tbtcUSD.toString(),
      keepCoveragePool: keepCoveragePool.toString(),
      keepStaking: keepStaking.toString(),
      tStaking: tStaking.toString(),
      nu: totalNu.toString(),
      total: ecdsa
        .addUnsafe(tbtcUSD)
        .addUnsafe(keepCoveragePool)
        .addUnsafe(keepStaking)
        .addUnsafe(tStaking)
        .addUnsafe(totalNu)
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
    stakedNU,
    ethInNuNetwork,
    nu.usdConversion,
  ])

  return [data, fetchTVLData]
}
