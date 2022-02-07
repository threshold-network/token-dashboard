import KeepTokenStaking from "@keep-network/keep-core/artifacts/TokenStaking.json"
import { useContract } from "./useContract"
import { getContractAddressFromTruffleArtifact } from "../../utils/getContract"

const KEEP_TOKEN_STAKING_ADDRESS =
  getContractAddressFromTruffleArtifact(KeepTokenStaking)

export const useKeepTokenStakingContract = () => {
  return useContract(KEEP_TOKEN_STAKING_ADDRESS, KeepTokenStaking.abi)
}
