import { useContract } from "./useContract"
import KeepBonding from "@keep-network/keep-ecdsa/artifacts/KeepBonding.json"

export const useKeepBondingContract = () => {
  // TODO get chainId from env
  return useContract(KeepBonding.networks["1337"].address, KeepBonding.abi)
}
