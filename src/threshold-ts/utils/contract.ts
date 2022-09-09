import { Contract, ContractInterface, providers, Signer } from "ethers"

export const getContract = (
  address: string,
  abi: ContractInterface,
  providerOrSigner: providers.Provider | Signer | undefined
) => {
  return new Contract(address, abi, providerOrSigner)
}
