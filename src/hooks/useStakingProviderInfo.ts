import { useCallback } from "react"
import {
  useMulticallContract,
  usePREContract,
  useTStakingContract,
} from "../web3/hooks"
import { decodeMulticallResult, getMulticallContractCall } from "../web3/utils"
import { StakingProviderInfoData } from "../types/staking"
import { useCheckEthBalanceForAccounts } from "./useCheckEthBalanceForAccounts"
import { isZeroAddress } from "ethereumjs-util"

export const useStakingProviderInfo = (): ((
  stakingProviders: string[]
) => Promise<StakingProviderInfoData>) => {
  const preContract = usePREContract()
  const tStakingContract = useTStakingContract()
  const multicallContract = useMulticallContract()
  const checkAccountsBalances = useCheckEthBalanceForAccounts()

  return useCallback(
    async (stakingProviders) => {
      if (
        !stakingProviders ||
        stakingProviders.length === 0 ||
        !preContract ||
        !tStakingContract ||
        !multicallContract
      ) {
        return {} as StakingProviderInfoData
      }

      const stakingProviderInfoMulticalls = stakingProviders.map(
        (stakingProvider) => {
          return {
            contract: preContract,
            method: "stakingProviderInfo",
            args: [stakingProvider],
          }
        }
      )

      const stakingProviderInfoMulticallRequests =
        stakingProviderInfoMulticalls.map(getMulticallContractCall)

      const [, stakingProviderInfoResults] = await multicallContract?.aggregate(
        stakingProviderInfoMulticallRequests
      )

      const stakingProvidersInfoDataRaw = decodeMulticallResult(
        stakingProviderInfoResults,
        stakingProviderInfoMulticalls
      )

      const accountsBalances = await checkAccountsBalances(
        stakingProvidersInfoDataRaw.map((data) => data.operator)
      )

      return stakingProvidersInfoDataRaw.reduce(
        (
          finalData: StakingProviderInfoData,
          _,
          idx
        ): StakingProviderInfoData => {
          finalData[stakingProviders[idx]] = {
            operator: _.operator,
            operatorConfirmed: _.operatorConfirmed,
            operatorStartTimestamp: _.operatorStartTimestamp.toString(),
            operatorEthBalance: isZeroAddress(_.operator)
              ? "0"
              : accountsBalances[_.operator],
          }
          return finalData
        },
        {}
      )
    },
    [preContract, tStakingContract, multicallContract]
  )
}
