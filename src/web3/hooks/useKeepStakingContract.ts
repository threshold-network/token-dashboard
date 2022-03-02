import { useContract } from "./useContract"
import KeepStaking from "@keep-network/keep-core/artifacts/TokenStaking.json"
import { getContractAddressFromTruffleArtifact } from "../../utils/getContract"

export const useKeepStakingContract = () => {
  return useContract(
    getContractAddressFromTruffleArtifact(KeepStaking),
    KeepStaking.abi
  )
}
