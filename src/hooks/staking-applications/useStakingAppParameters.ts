import { StakingAppName } from "../../store/staking-applications"
import { useStakingApplicationState } from "./useStakingApplicationState"

export const useStakingAppParameters = (appName: StakingAppName) => {
  return useStakingApplicationState(appName)?.parameters
}
