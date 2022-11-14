import { useThreshold } from "../../contexts/ThresholdContext"

export const useMerkleDropContract = () => {
  return useThreshold().rewards.merkleDropContract.instance
}
