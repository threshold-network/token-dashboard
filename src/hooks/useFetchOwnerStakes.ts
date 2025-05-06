import { useCallback } from "react"
import { StakeData } from "../types/staking"
import { setStakes } from "../store/staking"
import { useThreshold } from "../contexts/ThresholdContext"
import { useAppDispatch } from "./store"
import { isSameChainNameOrId } from "../networks/utils"

export const useFetchOwnerStakes = () => {
  const threshold = useThreshold()
  const dispatch = useAppDispatch()

  return useCallback(
    async (
      address?: string,
      chainId?: string | number
    ): Promise<StakeData[]> => {
      if (
        !address ||
        !threshold.staking ||
        !chainId ||
        !isSameChainNameOrId(threshold.config.ethereum.chainId, chainId)
      ) {
        return []
      }

      const stakes = await threshold.staking.getOwnerStakes(address)

      const stakingProviders = stakes.map((stake) => stake.stakingProvider)

      const _stakes: StakeData[] = stakes.map((stake) => ({
        ...stake,
        nuInTStake: stake.nuInTStake.toString(),
        keepInTStake: stake.keepInTStake.toString(),
        tStake: stake.tStake.toString(),
        totalInTStake: stake.totalInTStake.toString(),
        possibleKeepTopUpInT: stake.possibleKeepTopUpInT.toString(),
        possibleNuTopUpInT: stake.possibleNuTopUpInT.toString(),
      }))

      dispatch(setStakes(_stakes))

      return _stakes
    },
    [threshold.config.ethereum, dispatch]
  )
}
