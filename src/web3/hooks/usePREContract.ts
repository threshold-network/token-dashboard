import { useThreshold } from "../../contexts/ThresholdContext"
import { supportedChainId } from "../../utils/getEnvVariable"

export const PRE_DEPLOYMENT_BLOCK = supportedChainId === "1" ? 14141140 : 0

export const usePREContract = () => {
  return useThreshold().multiAppStaking.pre.contract
}
