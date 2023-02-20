import { useThreshold } from "../../contexts/ThresholdContext"

export const useTBTCVaultContract = () => {
  return useThreshold().tbtc.vaultContract
}
