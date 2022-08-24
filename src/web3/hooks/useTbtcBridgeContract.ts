// TODO: Import the correct contract here
import TbtcBridgeContract from "@threshold-network/solidity-contracts/artifacts/TokenStaking.json"
import { useContract } from "./useContract"

export const useTbtcBridgeContract = () => {
  return useContract(TbtcBridgeContract.address, TbtcBridgeContract.abi)
}
