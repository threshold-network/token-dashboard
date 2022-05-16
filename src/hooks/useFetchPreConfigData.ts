import { useCallback } from "react"
import { useMulticallContract, usePREContract } from "../web3/hooks"
import { decodeMulticallResult, getMulticallContractCall } from "../web3/utils"
import { PreConfigData } from "../types/staking"
import { useCheckEthBalanceForAccounts } from "./useCheckEthBalanceForAccounts"
import { isZeroAddress } from "ethereumjs-util"

export const useFetchPreConfigData = (): ((
  stakingProviders: string[]
) => Promise<PreConfigData>) => {
  const preContract = usePREContract()
  const multicallContract = useMulticallContract()
  const checkAccountsBalances = useCheckEthBalanceForAccounts()

  return useCallback(
    async (stakingProviders) => {
      if (
        !stakingProviders ||
        stakingProviders.length === 0 ||
        !preContract ||
        !multicallContract
      ) {
        return {} as PreConfigData
      }

      const preConfigDataMulticalls = stakingProviders.map(
        (stakingProvider) => {
          return {
            contract: preContract,
            method: "stakingProviderInfo",
            args: [stakingProvider],
          }
        }
      )

      const preConfigDataMulticallRequests = preConfigDataMulticalls.map(
        getMulticallContractCall
      )

      const [, preConfigDataResults] = await multicallContract?.aggregate(
        preConfigDataMulticallRequests
      )

      const preConfigDataRaw = decodeMulticallResult(
        preConfigDataResults,
        preConfigDataMulticalls
      )

      const accountsBalances = await checkAccountsBalances(
        preConfigDataRaw.map((data) => data.operator)
      )

      return preConfigDataRaw.reduce(
        (finalData: PreConfigData, _, idx): PreConfigData => {
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
    [preContract, multicallContract]
  )
}
