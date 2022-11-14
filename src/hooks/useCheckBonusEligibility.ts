import { useEffect } from "react"
import { selectStakingProviders } from "../store/staking"
import { useSelector } from "react-redux"
import { RootState } from "../store"
import { setStakingBonus } from "../store/rewards"
import { useAppDispatch } from "./store"
import { useThreshold } from "../contexts/ThresholdContext"

export const useCheckBonusEligibility = () => {
  const stakingProviders = useSelector(selectStakingProviders)
  const { hasFetched, isFetching } = useSelector(
    (state: RootState) => state.rewards.stakingBonus
  )
  const dispatch = useAppDispatch()
  const threshold = useThreshold()

  useEffect(() => {
    const fetch = async () => {
      if (
        !stakingProviders ||
        stakingProviders.length === 0 ||
        (hasFetched && !isFetching)
      ) {
        return
      }

      const stakingProvidersInfo =
        await threshold.rewards.stakingBonus.calculateRewards(stakingProviders)
      dispatch(setStakingBonus(stakingProvidersInfo))
    }
    fetch()
  }, [stakingProviders, threshold, dispatch, hasFetched, isFetching])
}
