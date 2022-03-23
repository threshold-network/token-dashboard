import { useCallback } from "react"
import { BigNumber } from "ethers"
import { useTStakingContract } from "./useTStakingContract"
import { useKeepTokenStakingContract } from "./useKeepTokenStakingContract"
import { useMulticallContract } from "./useMulticallContract"
import { getMulticallContractCall, decodeMulticallResult } from "../utils"
import { isAddressZero } from "../../web3/utils"

const useCheckDuplicateProviderAddress = (): ((
  stakingProvider: string
) => Promise<{
  isProviderUsedForKeep: boolean
  isProviderUsedForT: boolean
}>) => {
  const multicallContract = useMulticallContract()
  const tStakingContract = useTStakingContract()
  const keepStakingContract = useKeepTokenStakingContract()

  const checkIfProviderUsed = useCallback(
    async (stakingProvider) => {
      if (!tStakingContract || !multicallContract || !keepStakingContract) {
        throw new Error(
          "The request cannot be executed because the contract instances do not exist."
        )
      }
      const multicalls = [
        {
          contract: tStakingContract,
          method: "rolesOf",
          args: [stakingProvider],
        },
        {
          contract: keepStakingContract,
          method: "getDelegationInfo",
          args: [stakingProvider],
        },
      ]
      const multiCallsRequests = multicalls.map(getMulticallContractCall)

      const [, result] = await multicallContract?.aggregate(multiCallsRequests)
      const data = decodeMulticallResult(result, multicalls)

      const [{ owner }, [, createdAt]] = data

      const isProviderUsedForKeep = createdAt.gt(BigNumber.from(0))
      const isProviderUsedForT = !isAddressZero(stakingProvider)

      return { isProviderUsedForKeep, isProviderUsedForT }
    },
    [tStakingContract, keepStakingContract]
  )

  return checkIfProviderUsed
}

export default useCheckDuplicateProviderAddress
