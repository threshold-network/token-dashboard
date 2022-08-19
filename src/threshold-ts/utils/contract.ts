import { Contract, ContractInterface } from "ethers"

export const getContract = (address: string, abi: ContractInterface) => {
  return new Contract(address, abi)
}
