import { StakingAppName } from "../../store/staking-applications"
import { useStakingAppParameters } from "./useStakingAppParameters"

export const useStakingApplicationDecreaseDelay = (appName: StakingAppName) => {
  return useStakingAppParameters(appName)?.data?.authorizationDecreaseDelay
}
