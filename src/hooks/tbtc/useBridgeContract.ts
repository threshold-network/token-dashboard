import { useContract } from "../../web3/hooks"
import BridgeContract from "@keep-network/tbtc-v2/artifacts/Bridge.json"

export const useBridgeContract = () => {
  return useContract(BridgeContract.address, BridgeContract.abi)
}
