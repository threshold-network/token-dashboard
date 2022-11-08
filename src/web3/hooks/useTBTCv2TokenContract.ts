import { useErc20TokenContract } from "./useERC20"
import { Token } from "../../enums"
import { useThreshold } from "../../contexts/ThresholdContext"

export const useTBTCv2TokenContract = () => {
  const threshold = useThreshold()
  return useErc20TokenContract(threshold.tokens.tbtc, Token.TBTCV2)
}
