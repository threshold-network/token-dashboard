import {
  useKeepBondingContract,
  useMulticall,
  useMulticallContract,
  useTBTCTokenContract,
  useKeepAssetPoolContract,
} from "../web3/hooks"

export const useFetchTvl = () => {
  const keepBonding = useKeepBondingContract()
  const multicall = useMulticallContract()
  const { contract: tbtcToken } = useTBTCTokenContract()
  const keepAssetPool = useKeepAssetPoolContract()

  return useMulticall([
    {
      contract: multicall!,
      method: "getEthBalance",
      args: [keepBonding?.address],
    },
    {
      contract: tbtcToken!,
      method: "totalSupply",
    },
    { contract: keepAssetPool!, method: "totalValue" },
  ])
}
