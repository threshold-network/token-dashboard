import { useCallback } from "react"
import { BigNumber } from "ethers"
import { useTStakingContract } from "./useTStakingContract"
import { useKeepTokenStakingContract } from "./useKeepTokenStakingContract"
import { isAddressZero } from "../../web3/utils"
import { useThreshold } from "../../contexts/ThresholdContext"

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
      if (!tStakingContract || !keepStakingContract) {
        throw new Error(
          "The request cannot be executed because the contract instances do not exist."
        )
      }

      const [{ owner }, [, createdAt]] = await threshold.multicall.aggregate([
        {
          interface: tStakingContract.interface,
          address: tStakingContract.address,
          method: "rolesOf",
          args: [stakingProvider],
        },
        {
          interface: keepStakingContract.interface,
          address: keepStakingContract.address,
          method: "getDelegationInfo",
          args: [stakingProvider],
        },
      ])

      const isProviderUsedForKeep = createdAt.gt(BigNumber.from(0))
      const isProviderUsedForT = !isAddressZero(owner)

      return { isProviderUsedForKeep, isProviderUsedForT }
    },
    [tStakingContract, keepStakingContract, threshold]
  )

  return checkIfProviderUsed
}

export default useCheckDuplicateProviderAddress
