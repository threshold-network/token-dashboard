import { useContract } from "./useContract"
import KeepStaking from "@keep-network/keep-core/artifacts/TokenStaking.json"
import { supportedChainId } from "../../utils/getEnvVariable"

export const useKeepStakingContract = () => {
  return useContract(
    (
      KeepStaking.networks[
        supportedChainId as keyof typeof KeepStaking.networks
      ] as { address: string }
    )?.address,
    KeepStaking.abi
  )
}
