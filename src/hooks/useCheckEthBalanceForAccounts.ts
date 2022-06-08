import { useCallback } from "react"
import { useMulticallContract } from "../web3/hooks"
import { decodeMulticallResult, getMulticallContractCall } from "../web3/utils"

interface CheckEthBalanceForAccountsResult {
  [address: string]: string
}

export const useCheckEthBalanceForAccounts = (): ((
  accounts: string[]
) => Promise<CheckEthBalanceForAccountsResult>) => {
  const multicallContract = useMulticallContract()

  return useCallback(
    async (accounts) => {
      if (!accounts || accounts.length === 0 || !multicallContract) {
        return {}
      }

      const ethBalancesMulticalls = accounts.map((account) => {
        return {
          contract: multicallContract,
          method: "getEthBalance",
          args: [account],
        }
      })

      const ethBalancesRequests = ethBalancesMulticalls.map(
        getMulticallContractCall
      )

      const [, ethBalancesResults] = await multicallContract?.aggregate(
        ethBalancesRequests
      )

      const result = decodeMulticallResult(
        ethBalancesResults,
        ethBalancesMulticalls
      )

      return result.reduce(
        (
          finalData: CheckEthBalanceForAccountsResult,
          _,
          idx
        ): CheckEthBalanceForAccountsResult => {
          finalData[accounts[idx]] = _.balance.toString()
          return finalData
        },
        {}
      )
    },
    [multicallContract]
  )
}
