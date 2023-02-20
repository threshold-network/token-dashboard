import { useBridgeContract } from "./tbtc/useBridgeContract"

export const useTBTCBridgeContractAddress = () => {
  const bridgeContract = useBridgeContract()

  return bridgeContract.address
}
