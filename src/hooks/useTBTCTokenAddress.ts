import { useThreshold } from "../contexts/ThresholdContext"
import { AddressZero } from "../web3/utils"

export const useTBTCTokenAddress = () => {
  const threshold = useThreshold()

  // TODO: get the tbtc token address from threshold ts lib
  return AddressZero
}
