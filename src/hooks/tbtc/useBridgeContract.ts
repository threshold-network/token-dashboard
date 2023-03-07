import { useThreshold } from "../../contexts/ThresholdContext"

export const useBridgeContract = () => {
  const threshold = useThreshold()

  return threshold.tbtc.bridgeContract
}
