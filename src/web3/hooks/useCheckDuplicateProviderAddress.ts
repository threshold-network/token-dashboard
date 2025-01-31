import { useCallback } from "react"
import { BigNumber } from "ethers"
import { useTStakingContract } from "./useTStakingContract"
import { useKeepTokenStakingContract } from "./useKeepTokenStakingContract"
import { AddressZero, isAddressZero } from "../../web3/utils"
import { useThreshold } from "../../contexts/ThresholdContext"
import { ContractCall } from "../../threshold-ts/multicall"

const useCheckDuplicateProviderAddress = (): ((
  stakingProvider: string
) => Promise<{
  isProviderUsedForKeep: boolean
  isProviderUsedForT: boolean
}>) => {
  const tStakingContract = useTStakingContract()
  const keepStakingContract = useKeepTokenStakingContract()
  const threshold = useThreshold()

  const checkIfProviderUsed = useCallback(
    async (stakingProvider) => {
      const multicall = threshold.multicall
      if (!multicall) {
        return {
          isProviderUsedForKeep: false,
          isProviderUsedForT: false,
        }
      }

      const calls: ContractCall[] = []

      if (tStakingContract?.interface && tStakingContract.address) {
        calls.push({
          interface: tStakingContract.interface,
          address: tStakingContract.address,
          method: "rolesOf",
          args: [stakingProvider],
        })
      }

      if (keepStakingContract?.interface && keepStakingContract.address) {
        calls.push({
          interface: keepStakingContract.interface,
          address: keepStakingContract.address,
          method: "getDelegationInfo",
          args: [stakingProvider],
        })
      }
      try {
        const results = await multicall.aggregate(calls)

        const tRolesResult = results[0] || {}
        const owner = tRolesResult?.owner || AddressZero

        const keepDelegationResult = results[1] || {}
        const createdAt = keepDelegationResult?.createdAt || BigNumber.from(0)

        const isProviderUsedForKeep =
          BigNumber.isBigNumber(createdAt) && createdAt.gt(0)
        const isProviderUsedForT = !isAddressZero(owner)

        return { isProviderUsedForKeep, isProviderUsedForT }
      } catch (error) {
        console.error("Multicall failed:", error)
        return {
          isProviderUsedForKeep: false,
          isProviderUsedForT: false,
        }
      }
    },
    [tStakingContract, keepStakingContract, threshold]
  )

  return checkIfProviderUsed
}

export default useCheckDuplicateProviderAddress
