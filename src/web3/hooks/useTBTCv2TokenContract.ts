import { useThreshold } from "../../contexts/ThresholdContext"

export const useTBTCv2TokenContract = () => {
  const threshold = useThreshold()
  return threshold.tbtc.tokenContract
}
