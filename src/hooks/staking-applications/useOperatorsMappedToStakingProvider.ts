import { StakingAppName } from "../../store/staking-applications"
import { useStakingApplicationState } from "./useStakingApplicationState"

export const useOperatorsMappedToStakingProvider = (
  appName: StakingAppName
) => {
  return useStakingApplicationState(appName).mappedOperator.data
}
