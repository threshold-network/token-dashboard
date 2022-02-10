import { useTStakingContract } from "./useTStakingContract"
import { useCallback } from "react"
import { useKeepStakingContract } from "./useKeepStakingContract"
import { BigNumber } from "ethers"
import { AddressZero } from "@ethersproject/constants"

const useCheckDuplicateProviderAddress = (): ((
  stakingProvider: string
) => Promise<{
  isProviderUsedForKeep: boolean
  isProviderUsedForT: boolean
}>) => {
  const tStakingContract = useTStakingContract()
  const keepStakingContract = useKeepStakingContract()

  const checkIfProviderUsed = useCallback(
    async (stakingProvider) => {
      const { owner } = await tStakingContract?.rolesOf(stakingProvider)

      const [, createdAt]: [unknown, BigNumber] =
        await keepStakingContract?.getDelegationInfo(stakingProvider)

      const isProviderUsedForKeep = createdAt.gt(BigNumber.from(0))
      const isProviderUsedForT = owner !== AddressZero
      // TODO Add Check for Nu/PRE stakes

      return { isProviderUsedForKeep, isProviderUsedForT }
    },
    [tStakingContract]
  )

  return checkIfProviderUsed
}

export default useCheckDuplicateProviderAddress
