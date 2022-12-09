import { useThreshold } from "../contexts/ThresholdContext"
import { AddressZero } from "../web3/utils"

export const useTBTCBridgeContractAddress = () => {
  const threshold = useThreshold()

  // TODO: set the bridge contract address from `threshold-ts` lib
  return AddressZero // threshold.tbtc.bridge.address
}
