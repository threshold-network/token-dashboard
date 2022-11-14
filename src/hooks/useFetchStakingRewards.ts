import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "./store"
import { setInterimRewards } from "../store/rewards"
import { selectStakingProviders } from "../store/staking"
import { useThreshold } from "../contexts/ThresholdContext"

export const useFetchStakingRewards = () => {
  const stakingProviders = useAppSelector(selectStakingProviders)
  const { hasFetched, isFetching } = useAppSelector(
    (state) => state.rewards.interim
  )
  const dispatch = useAppDispatch()
  const threshold = useThreshold()

  useEffect(() => {
    const fetch = async () => {
      if (stakingProviders.length === 0 || (hasFetched && !isFetching)) {
        return
      }

      const stakingRewards = await threshold.rewards.interim.calculateRewards(
        stakingProviders
      )

      dispatch(setInterimRewards(stakingRewards))
    }

    fetch()
  }, [stakingProviders, hasFetched, isFetching, dispatch, threshold])
}
