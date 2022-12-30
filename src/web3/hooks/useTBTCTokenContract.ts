import { useErc20TokenContract } from "./useERC20"
import { useThreshold } from "../../contexts/ThresholdContext"
import { Token } from "../../enums"

export const useTBTCTokenContract = () => {
  const threshold = useThreshold()
  return useErc20TokenContract(threshold.token.tbtcv1, Token.TBTCV1)
}
