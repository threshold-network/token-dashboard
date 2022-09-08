import {
  selectStakingAppByStakingProvider,
  StakingAppName,
} from "../../store/staking-applications"
import { useAppSelector } from "../store"

export const useStakingAppDataByStakingProvider = (
  appName: StakingAppName,
  stakingProvider: string
) => {
  return useAppSelector((state) =>
    selectStakingAppByStakingProvider(state, appName, stakingProvider)
  )
}
