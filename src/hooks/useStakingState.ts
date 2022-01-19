import { useSelector, useDispatch } from "react-redux"
import { updateState as updateStateAction } from "../store/staking"
import { RootState } from "../store"
import { StakingStateKey, UseStakingState } from "../types/staking"

export const useStakingState: UseStakingState = () => {
  const stakingState = useSelector((state: RootState) => state.staking)
  const dispatch = useDispatch()

  const updateState = (key: StakingStateKey, value: any) =>
    dispatch(updateStateAction({ key, value }))

  return {
    ...stakingState,
    updateState,
  }
}
