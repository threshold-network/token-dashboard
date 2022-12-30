import { useErc20TokenContract } from "./useERC20"
import { Token } from "../../enums"
import { useThreshold } from "../../contexts/ThresholdContext"

export const useNu = () => {
  const threshold = useThreshold()
  return useErc20TokenContract(threshold.token.nu, Token.Nu)
}
