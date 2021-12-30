import { useContract } from "./useContract"
import KeepBonding from "@keep-network/keep-ecdsa/artifacts/KeepBonding.json"
import { supportedChainId } from "../../utils/getEnvVariable"

export const useKeepBondingContract = () => {
  return useContract(
    (
      KeepBonding.networks[
        supportedChainId as keyof typeof KeepBonding.networks
      ] as { address: string }
    )?.address,
    KeepBonding.abi
  )
}
