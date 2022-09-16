import {
  StakingAppName,
  selectStakingAppStateByAppName,
} from "../../store/staking-applications"
import { useAppSelector } from "../store"

export const useStakingApplicationState = (appName: StakingAppName) => {
  return useAppSelector((state) =>
    selectStakingAppStateByAppName(state, appName)
  )
}
