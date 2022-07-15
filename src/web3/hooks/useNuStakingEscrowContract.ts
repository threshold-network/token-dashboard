import NuCypherStakingEscrow from "@threshold-network/solidity-contracts/artifacts/NuCypherStakingEscrow.json"
import { useContract } from "./useContract"

export const useNuStakingEscrowContract = () => {
  return useContract(NuCypherStakingEscrow.address, NuCypherStakingEscrow.abi)
}
