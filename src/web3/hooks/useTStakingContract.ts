import TStakingContract from "@threshold-network/solidity-contracts/artifacts/TokenStaking.json"
import { useContract } from "./useContract"

export const useTStakingContract = () => {
  return useContract(TStakingContract.address, TStakingContract.abi)
}
