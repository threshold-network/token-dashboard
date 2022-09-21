import { StakingAppName } from "../../store/staking-applications"
import { useStakingAppParameters } from "./useStakingAppParameters"

export const useStakingAppMinAuthorizationAmount = (
  appName: StakingAppName
) => {
  return useStakingAppParameters(appName).data.minimumAuthorization
}
