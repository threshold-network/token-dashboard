import { useThreshold } from "../../contexts/ThresholdContext"

export const useNuStakingEscrowContract = () => {
  const threshold = useThreshold()

  return threshold.staking.legacyNuStakingContract
}
